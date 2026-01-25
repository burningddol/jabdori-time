'use client';

import Image from 'next/image';
import { FRIENDS} from '@/constants/friends';
import { FriendsBarWrapper, FriendAvatarButton } from './styles';

interface Props {
  currentTypingFriendIndex: number | null;
  onFriendClick: (index: number) => void;
}

export function FriendsBar({ currentTypingFriendIndex, onFriendClick }: Props) {
  return (
    <FriendsBarWrapper>
      {FRIENDS.map((friend, i) => (
        <FriendAvatarButton
          key={i}
        
          $active={currentTypingFriendIndex === i}
          onClick={() => onFriendClick(i)}
          aria-label={`${friend.name} 프로필 보기`}
        >
          <div className="avatar">
            <Image src={friend.profile} width={48} height={48} alt={`${friend.name} 프로필`} priority />
          </div>
        </FriendAvatarButton>
      ))}
    </FriendsBarWrapper>
  );
}
