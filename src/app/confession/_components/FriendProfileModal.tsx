'use client';

import Image from 'next/image';
import { FRIENDS, FRIEND_COLORS } from '@/constants/friends';
import {
  ModalOverlay,
  ModalPanel,
  ModalCloseButton,
  ModalProfileImage,
  ModalName,
  ModalTagline,
  ModalBadges,
  Badge,
  ModalBio,
  ModalRoastStyle,
} from './styles';

interface Props {
  friendIndex: number;
  onClose: () => void;
}

export function FriendProfileModal({ friendIndex, onClose }: Props) {
  const friend = FRIENDS[friendIndex];
  const color = FRIEND_COLORS[friendIndex];

  return (
    <>
      <ModalOverlay onClick={onClose} aria-label="모달 닫기" />
      <ModalPanel $color={color} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <ModalCloseButton onClick={onClose} aria-label="닫기">
          ×
        </ModalCloseButton>

        <ModalProfileImage>
          <Image src={friend.profile} fill alt={`${friend.name} 프로필`} />
        </ModalProfileImage>

        <ModalName id="modal-title">{friend.name}</ModalName>
        <ModalTagline $color={color}>{friend.tagline}</ModalTagline>

        <ModalBadges>
          {friend.badges.map((badge) => (
            <Badge key={badge} $color={color}>
              {badge}
            </Badge>
          ))}
        </ModalBadges>

        <ModalBio>{`${friend.bio}`}</ModalBio>

        <ModalRoastStyle>
          <div className="label">잡도리 스타일</div>
          <div className="value">{friend.roastStyle}</div>
        </ModalRoastStyle>
      </ModalPanel>
    </>
  );
}
