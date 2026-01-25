'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FRIENDS } from '@/constants/friends';
import type { RenderedMessage } from '@/hooks/useSequentialTyping';
import { MessageBubble, ChatAvatarButton } from './styles';

interface Props {
  message: RenderedMessage;
  onAvatarClick?: (index: number) => void;
}

export function ChatMessage({ message, onAvatarClick }: Props) {
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
  const friend = FRIENDS[message.friendIndex];

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
      </div>
    </MessageBubble>
  );
}
