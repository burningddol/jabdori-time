'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FRIENDS, FRIEND_COLORS } from '@/constants/friends';
import type { RenderedMessage } from '@/hooks/useSequentialTyping';
import { MessageBubble, ChatAvatarButton, SpeakerButton } from './styles';

interface Props {
  message: RenderedMessage;
  messageId: number;
  onAvatarClick?: (index: number) => void;
  onSpeakerClick?: (text: string, friendIndex: number, messageId: number) => void;
  isPlaying?: boolean;
}

export function ChatMessage({ message, messageId, onAvatarClick, onSpeakerClick, isPlaying }: Props) {
  const [pop, setPop] = useState(false);
  const prevStatus = useRef(message.status);

  useEffect(() => {
    if (prevStatus.current === 'typing' && message.status === 'complete') {
      setPop(true);
      const timer = setTimeout(() => setPop(false), 300);
      return () => clearTimeout(timer);
    }
    prevStatus.current = message.status;
  }, [message.status]);

  const isTyping = message.status === 'typing';
  const isComplete = message.status === 'complete';
  const friend = FRIENDS[message.friendIndex];
  const friendColor = FRIEND_COLORS[message.friendIndex];

  const handleSpeakerClick = () => {
    if (onSpeakerClick && isComplete) {
      onSpeakerClick(message.fullText, message.friendIndex, messageId);
    }
  };

  return (
    <MessageBubble $friendIndex={message.friendIndex} $pop={pop}>
      <ChatAvatarButton
        onClick={() => onAvatarClick?.(message.friendIndex)}
        aria-label={`${friend.name} 프로필 보기`}
      >
        <div className="imgWrapper">
          <Image src={friend.profile} width={36} height={36} alt={`${friend.name} 프로필`} />
        </div>
      </ChatAvatarButton>
      <div className="content">
        <div className="name">{friend.name}</div>
        <div className="text">
          {isTyping ? message.typedText : message.fullText}
          {isTyping && <span className="cursor" />}
        </div>
        {isComplete && onSpeakerClick && (
          <SpeakerButton
            onClick={handleSpeakerClick}
            $isPlaying={isPlaying}
            $color={friendColor}
            aria-label={isPlaying ? '음성 정지' : '음성으로 듣기'}
            title={isPlaying ? '정지' : '음성으로 듣기'}
          >
            {isPlaying ? '⏹' : '🔊'}
          </SpeakerButton>
        )}
      </div>
    </MessageBubble>
  );
}
