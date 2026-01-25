'use client';

import Image from 'next/image';
import { FRIENDS } from '@/constants/friends';
import { TypingBubble, ChatAvatarButton } from './styles';

interface Props {
  friendIndex: number;
  onAvatarClick?: (index: number) => void;
}

export function TypingIndicator({ friendIndex, onAvatarClick }: Props) {
  const friend = FRIENDS[friendIndex];

  return (
    <TypingBubble $friendIndex={friendIndex}>
      <ChatAvatarButton
        onClick={() => onAvatarClick?.(friendIndex)}
        aria-label={`${friend.name} 프로필 보기`}
      >
        <Image src={friend.profile} width={36} height={36} alt={`${friend.name} 프로필`} />
      </ChatAvatarButton>
      <div className="content">
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
        <span className="label">{friend.name} is typing</span>
      </div>
    </TypingBubble>
  );
}
