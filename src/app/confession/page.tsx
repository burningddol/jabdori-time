'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { confessionSchema, type ConfessionFormData } from '@/lib/validation';
import { submitConfession } from '@/shares/axios';
import { parseResponse } from '@/lib/parseResponse';
import { useSequentialTyping, type ParsedMessage } from '@/hooks/useSequentialTyping';
import { useModal } from '@/hooks/useModal';
import {
  FriendProfileModal,
  TypingIndicator,
  ChatMessage,
  ConfessionForm,
  FriendsBar,
  Container,
  Header,
  BackButton,
  Title,
  ChatArea,
  SystemMessage,
  ResponseArea,
  MessageBubble,
  ResetButton,
} from './_components';

type FormErrors = Partial<Record<keyof ConfessionFormData, string>>;

const INITIAL_FORM: ConfessionFormData = { name: '', task: '', excuse: '', tone: 'spicy' };

export default function ConfessionPage() {
  const router = useRouter();
  const chatAreaRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<ConfessionFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [messages, setMessages] = useState<ParsedMessage[]>([]);

  const modal = useModal<number>();

  const { renderedMessages, currentTypingFriendIndex, isComplete, reset: resetTyping } =
    useSequentialTyping(messages, {
      baseSpeed: 25,
      jitter: 20,
      punctuationDelay: 120,
      typingIndicatorDuration: [600, 1400],
      interMessageDelay: 350,
    });

  useEffect(() => {
    if (chatAreaRef.current && isSubmitted) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [renderedMessages, currentTypingFriendIndex, isSubmitted]);

  const handleChange = (field: keyof ConfessionFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = confessionSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((err) => {
        fieldErrors[err.path[0] as keyof FormErrors] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const res = await submitConfession(formData);
      setMessages(parseResponse(res.answer));
      setIsSubmitted(true);
    } catch {
      setErrors({ task: 'Failed to submit. Try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM);
    setIsSubmitted(false);
    setMessages([]);
    setErrors({});
    resetTyping();
  };

  const typingIndicator = renderedMessages.find((m) => m.status === 'typing-indicator');

  return (
    <Container>
      <Header>
        <BackButton onClick={() => router.push('/')}>← Back</BackButton>
        <Title>
          JABDORI TIME<span>~</span>
        </Title>
        <div style={{ width: 60 }} />
      </Header>

      <FriendsBar currentTypingFriendIndex={currentTypingFriendIndex} onFriendClick={modal.open} />

      {modal.isOpen && modal.selected !== null && (
        <FriendProfileModal friendIndex={modal.selected} onClose={modal.close} />
      )}

      <ChatArea ref={chatAreaRef}>
        <SystemMessage>자, 이번엔 무슨 변명인가요?</SystemMessage>

        {!isSubmitted ? (
          <ConfessionForm
            formData={formData}
            errors={errors}
            isLoading={isLoading}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        ) : (
          <>
            <MessageBubble $isUser>
              <div className="avatar">🙈</div>
              <div className="content">
                <div className="text">
                  <strong>Task:</strong> {formData.task}
                  <br />
                  <strong>Excuse:</strong> {formData.excuse}
                </div>
              </div>
            </MessageBubble>

            <ResponseArea>
              {renderedMessages
                .filter((m) => m.status === 'typing' || m.status === 'complete')
                .map((m, i) => (
                  <ChatMessage key={i} message={m} onAvatarClick={modal.open} />
                ))}
              {typingIndicator && (
                <TypingIndicator
                  friendIndex={typingIndicator.friendIndex}
                  onAvatarClick={modal.open}
                />
              )}
            </ResponseArea>

            {isComplete && <ResetButton onClick={handleReset}>다른 잘못을 자백하러가기</ResetButton>}
          </>
        )}
      </ChatArea>
    </Container>
  );
}
