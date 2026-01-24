'use client';
import yura from "@/assets/yuah.png";
import suho from "@/assets/suho.png";
import jiwoo from "@/assets/jiwoo.png";
import doah from "@/assets/doah.png";
import donggu from "@/assets/donggu.png";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styled, { keyframes, css } from 'styled-components';
import { confessionSchema, type ConfessionFormData } from '@/lib/validation';
import { submitConfession } from '@/shares/axios';
import { useSequentialTyping, type ParsedMessage, type RenderedMessage } from '@/hooks/useSequentialTyping';
import Image from "next/image";
const FRIENDS = [
  { profile: yura, name: '차유라' },
  { profile: suho, name: '김수호' },
  { profile: jiwoo, name: '임지우' },
  { profile: doah, name: '김도아' },
  { profile: donggu, name: '강동구' },
];

const FRIEND_COLORS = ['#e7f59b', '#9da5eb', '#adb65b', '#cea0f3', '#d4ddd6'];

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeInSlide = keyframes`
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

const popIn = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
`;

const typingBounce = keyframes`
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-4px); }
`;

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const BackButton = styled.button`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.875rem;
  transition: color ${({ theme }) => theme.transitions.fast};
  &:hover { color: ${({ theme }) => theme.colors.text}; }
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  span { color: ${({ theme }) => theme.colors.primary}; }
`;

const FriendsBar = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg} 0;
`;

const FriendAvatar = styled.div<{ $color: string; $active?: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ $color }) => $color}22;
  border: 2px solid ${({ $color, $active }) => ($active ? $color : 'transparent')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: all ${({ theme }) => theme.transitions.fast};
  animation: ${({ $active }) => ($active ? bounce : 'none')} 0.5s ease infinite;

  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;
  }
  &:hover {
    transform: scale(1.1);
    border-color: white;
  }
`;

const ChatArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.md} 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SystemMessage = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.textDim};
  font-size: 0.875rem;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  animation: ${fadeIn} 0.5s ease;
`;

const MessageBubble = styled.div<{ $friendIndex?: number; $isUser?: boolean; $pop?: boolean }>`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: flex-start;
  animation: ${fadeInSlide} 0.3s ease;
  flex-direction: ${({ $isUser }) => ($isUser ? 'row-reverse' : 'row')};

  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
  }

  .content {
    max-width: 70%;
    background: ${({ $isUser, theme }) => $isUser ? theme.colors.primary : theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
    padding: ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    ${({ $isUser }) => $isUser ? 'border-top-right-radius: 4px;' : 'border-top-left-radius: 4px;'}
    ${({ $pop }) => $pop && css`animation: ${popIn} 0.3s ease;`}
  }

  .name {
    font-size: 0.75rem;
    color: ${({ $friendIndex }) => FRIEND_COLORS[$friendIndex || 0]};
    font-weight: 600;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }

  .text {
    font-size: 0.9375rem;
    line-height: 1.5;
    white-space: pre-wrap;
  }

  .cursor {
    display: inline-block;
    width: 2px;
    height: 1em;
    background: ${({ theme }) => theme.colors.text};
    margin-left: 1px;
    animation: ${pulse} 0.8s ease-in-out infinite;
    vertical-align: text-bottom;
  }
`;

const TypingBubble = styled.div<{ $friendIndex: number }>`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: flex-start;
  animation: ${fadeInSlide} 0.2s ease;

  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
  }

  .content {
    background: ${({ theme }) => theme.colors.surface};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    border-top-left-radius: 4px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .dot {
    width: 8px;
    height: 8px;
    background: ${({ $friendIndex }) => FRIEND_COLORS[$friendIndex]};
    border-radius: 50%;
    animation: ${typingBounce} 1.4s ease-in-out infinite;
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }

  .label {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.textDim};
    margin-left: ${({ theme }) => theme.spacing.xs};
  }
`;

const Form = styled.form`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  animation: ${fadeIn} 0.5s ease;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
`;

const Input = styled.input<{ $error?: boolean }>`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ $error, theme }) => $error ? theme.colors.error : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9375rem;
  &::placeholder { color: ${({ theme }) => theme.colors.textDim}; }
  &:focus {
    outline: none;
    border-color: ${({ $error, theme }) => $error ? theme.colors.error : theme.colors.primary};
  }
`;

const TextArea = styled.textarea<{ $error?: boolean }>`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ $error, theme }) => $error ? theme.colors.error : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9375rem;
  resize: vertical;
  min-height: 80px;
  &::placeholder { color: ${({ theme }) => theme.colors.textDim}; }
  &:focus {
    outline: none;
    border-color: ${({ $error, theme }) => $error ? theme.colors.error : theme.colors.primary};
  }
`;

const ToneSelector = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ToneOption = styled.label<{ $selected: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ $selected, theme }) => $selected ? theme.colors.primary + '22' : theme.colors.background};
  border: 2px solid ${({ $selected, theme }) => $selected ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  &:hover { border-color: ${({ theme }) => theme.colors.primary}; }
  input { display: none; }
  span { font-size: 1.25rem; }
`;

const ErrorText = styled.span`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.75rem;
`;

const SubmitButton = styled.button<{ $loading?: boolean }>`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  font-weight: 700;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  opacity: ${({ $loading }) => ($loading ? 0.7 : 1)};
  pointer-events: ${({ $loading }) => ($loading ? 'none' : 'auto')};
  &:hover { background: ${({ theme }) => theme.colors.primaryHover}; transform: translateY(-2px); }
  &:active { transform: translateY(0); }
`;

const LoadingDots = styled.span`
  display: inline-flex;
  gap: 4px;
  span {
    width: 6px;
    height: 6px;
    background: ${({ theme }) => theme.colors.text};
    border-radius: 50%;
    animation: ${pulse} 1s ease-in-out infinite;
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
`;

const ResponseArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const ResetButton = styled.button`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.875rem;
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text};
  }
`;

type FormErrors = Partial<Record<keyof ConfessionFormData, string>>;

function parseResponse(answer: string): ParsedMessage[] {
  return answer
    .split('\n')
    .filter(line => line.trim())
    .map(line => {
      const match = line.match(/^친구(\d):\s*(.+)$/);
      if (match && +match[1] >= 1 && +match[1] <= 5) {
        return { friendIndex: +match[1] - 1, text: match[2].trim() };
      }
      return null;
    })
    .filter((m): m is ParsedMessage => m !== null);
}

function TypingIndicator({ friendIndex }: { friendIndex: number }) {
  return (
    <TypingBubble $friendIndex={friendIndex}>
      <div className="avatar">
        <Image src={FRIENDS[friendIndex].profile} width={36} height={36}  alt="프로필사진"/>
      </div>
      <div className="content">
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
        <span className="label">{FRIENDS[friendIndex].name} is typing</span>
      </div>
    </TypingBubble>
  );
}

function ChatMessage({ message }: { message: RenderedMessage }) {
  const [pop, setPop] = useState(false);
  const prevStatus = useRef(message.status);

  useEffect(() => {
    if (prevStatus.current === 'typing' && message.status === 'complete') {
      setPop(true);
      setTimeout(() => setPop(false), 300);
    }
    prevStatus.current = message.status;
  }, [message.status]);

  const isTyping = message.status === 'typing';

  return (
    <MessageBubble $friendIndex={message.friendIndex} $pop={pop}>
      <div className="avatar">
        <Image src={FRIENDS[message.friendIndex].profile} width={36} height={36}  alt="프로필사진"/>
      </div>
      <div className="content">
        <div className="name">{FRIENDS[message.friendIndex].name}</div>
        <div className="text">
          {isTyping ? message.typedText : message.fullText}
          {isTyping && <span className="cursor" />}
        </div>
      </div>
    </MessageBubble>
  );
}

export default function ConfessionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ConfessionFormData>({ name: '', task: '', excuse: '', tone: 'spicy' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [messages, setMessages] = useState<ParsedMessage[]>([]);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  const { renderedMessages, currentTypingFriendIndex, isComplete, reset: resetTyping } = useSequentialTyping(messages, {
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
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = confessionSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach(err => {
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
    setFormData({ name: '', task: '', excuse: '', tone: 'spicy' });
    setIsSubmitted(false);
    setMessages([]);
    setErrors({});
    resetTyping();
  };

  const typingIndicator = renderedMessages.find(m => m.status === 'typing-indicator');

  return (
    <Container>
      <Header>
        <BackButton onClick={() => router.push('/')}>← Back</BackButton>
        <Title>JABDORI TIME<span>~</span></Title>
        <div style={{ width: 60 }} />
      </Header>

      <FriendsBar>
        {FRIENDS.map((friend, i) => (
          <FriendAvatar key={i} $color={FRIEND_COLORS[i]} $active={currentTypingFriendIndex === i} title={friend.name}>
            <div className="avatar">
              <Image src={friend.profile} width={48} height={48}  alt="프로필사진"/>
            </div>
          </FriendAvatar>
        ))}
      </FriendsBar>

      <ChatArea ref={chatAreaRef}>
        <SystemMessage>자, 이번엔 무슨 핑계인가요?</SystemMessage>

        {!isSubmitted ? (
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>이름</Label>
              <Input
                placeholder="ex) 김춘식"
                value={formData.name}
                onChange={e => handleChange('name', e.target.value)}
                $error={!!errors.name}
              />
              {errors.name && <ErrorText>{errors.name}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label>당신의 할 일이 무엇이었나요?</Label>
              <TextArea
                placeholder="ex) 코딩강의 5개 듣기"
                value={formData.task}
                onChange={e => handleChange('task', e.target.value)}
                $error={!!errors.task}
              />
              {errors.task && <ErrorText>{errors.task}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label>오늘의 핑계는 무엇이었나요?</Label>
              <TextArea
                placeholder="ex) 음.. 조금 피곤하기도 하고,, 웹툰이 너무 재미있었어요"
                value={formData.excuse}
                onChange={e => handleChange('excuse', e.target.value)}
                $error={!!errors.excuse}
              />
              {errors.excuse && <ErrorText>{errors.excuse}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label>잡도리의 강도를 정해주세요</Label>
              <ToneSelector>
                <ToneOption $selected={formData.tone === 'spicy'}>
                  <input type="radio" name="tone" checked={formData.tone === 'spicy'} onChange={() => handleChange('tone', 'spicy')} />
                  <span>🌶️</span> 무자비한 불닭맛
                </ToneOption>
                <ToneOption $selected={formData.tone === 'mild'}>
                  <input type="radio" name="tone" checked={formData.tone === 'mild'} onChange={() => handleChange('tone', 'mild')} />
                  <span>🍵</span> 잔잔한 티타임
                </ToneOption>
              </ToneSelector>
            </FormGroup>

            <SubmitButton type="submit" $loading={isLoading}>
              {isLoading ? <LoadingDots><span /><span /><span /></LoadingDots> : '잡도리 타임'}
            </SubmitButton>
          </Form>
        ) : (
          <>
            <MessageBubble $isUser>
              <div className="avatar">🙈</div>
              <div className="content">
                <div className="text">
                  <strong>Task:</strong> {formData.task}<br />
                  <strong>Excuse:</strong> {formData.excuse}
                </div>
              </div>
            </MessageBubble>

            <ResponseArea>
              {renderedMessages
                .filter(m => m.status === 'typing' || m.status === 'complete')
                .map((m, i) => <ChatMessage key={i} message={m} />)}
              {typingIndicator && <TypingIndicator friendIndex={typingIndicator.friendIndex} />}
            </ResponseArea>

            {isComplete && <ResetButton onClick={handleReset}>Confess Another Sin</ResetButton>}
          </>
        )}
      </ChatArea>
    </Container>
  );
}
