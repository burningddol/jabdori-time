'use client';

import styled, { css } from 'styled-components';
import {
  fadeIn,
  fadeInSlide,
  pulse,
  bounce,
  popIn,
  typingBounce,
  modalFadeIn,
  modalSlideUp,
} from '@/styles/animations';
import { FRIEND_COLORS } from '@/constants/friends';

// Layout
export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const BackButton = styled.button`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.875rem;
  transition: color ${({ theme }) => theme.transitions.fast};
  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  span {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const FriendsBarWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg} 0;
`;

export const ChatArea = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md} 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const SystemMessage = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.textDim};
  font-size: 0.875rem;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  animation: ${fadeIn} 0.5s ease;
`;

export const ResponseArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

// Message Bubbles
export const MessageBubble = styled.div<{
  $friendIndex?: number;
  $isUser?: boolean;
  $pop?: boolean;
}>`
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
    position: relative;
    max-width: 70%;
    background: ${({ $isUser, theme }) =>
      $isUser ? theme.colors.primary : theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
    padding: ${({ theme }) => theme.spacing.md};
    padding-right: ${({ $isUser, theme }) => $isUser ? theme.spacing.md : '40px'};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    ${({ $isUser }) =>
      $isUser ? 'border-top-right-radius: 4px;' : 'border-top-left-radius: 4px;'}
    ${({ $pop }) =>
      $pop &&
      css`
        animation: ${popIn} 0.3s ease;
      `}
  }

  .name {
    font-size: 0.75rem;
    color: ${({ $friendIndex }) => FRIEND_COLORS[$friendIndex ?? 0]};
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

  .myName  {
    display: flex;
    justify-content: flex-end;
    font-size: 0.75rem;
    color: 0;
    font-weight: 600;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }

  .imgWrapper {
    width:36px;
    height:36px;
    border-radius: 50%;
  overflow: hidden;
  }
`;

export const TypingBubble = styled.div<{ $friendIndex: number }>`
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
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }

  .label {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.textDim};
    margin-left: ${({ theme }) => theme.spacing.xs};
  }
`;

// Avatar Buttons
export const FriendAvatarButton = styled.button<{  $active?: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  
  border: 2px solid ${({  $active }) => ($active ? "white" : 'transparent')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
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

  &:focus-visible {
    outline: 2px solid white;;
    outline-offset: 2px;
  }
`;

export const ChatAvatarButton = styled.button`
  
  
  border: none;
  padding: 0;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: scale(1.1);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
   .imgWrapper {
    width:36px;
    height:36px;
    border-radius: 50%;
  overflow: hidden;
  }
`;

// Form Elements
export const Form = styled.form`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  animation: ${fadeIn} 0.5s ease;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
`;

export const Input = styled.input<{ $error?: boolean }>`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid
    ${({ $error, theme }) => ($error ? theme.colors.error : theme.colors.border)};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9375rem;
  &::placeholder {
    color: ${({ theme }) => theme.colors.textDim};
  }
  &:focus {
    outline: none;
    border-color: ${({ $error, theme }) =>
      $error ? theme.colors.error : theme.colors.primary};
  }
`;

export const TextArea = styled.textarea<{ $error?: boolean }>`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid
    ${({ $error, theme }) => ($error ? theme.colors.error : theme.colors.border)};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9375rem;
  resize: vertical;
  min-height: 80px;
  &::placeholder {
    color: ${({ theme }) => theme.colors.textDim};
  }
  &:focus {
    outline: none;
    border-color: ${({ $error, theme }) =>
      $error ? theme.colors.error : theme.colors.primary};
  }
`;

export const ToneSelector = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const ToneOption = styled.label<{ $selected: boolean }>`
 position :relative ;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 63px;
  padding-right: 8px;
  background: ${({ $selected, theme }) =>
    $selected ? theme.colors.primary + '22' : theme.colors.background};
  border: 2px solid
    ${({ $selected, theme }) => ($selected ? theme.colors.primary : theme.colors.border)};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
  input {
    display: none;
  }
 img{
  @media (max-width: 768px) {
    
      width: 40px;
      height: 40px ;
  }
 }
`;

export const ErrorText = styled.span`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.75rem;
`;

export const SubmitButton = styled.button<{ $loading?: boolean }>`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  font-weight: 700;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  opacity: ${({ $loading }) => ($loading ? 0.7 : 1)};
  pointer-events: ${({ $loading }) => ($loading ? 'none' : 'auto')};
  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
    transform: translateY(-2px);
  }
  &:active {
    transform: translateY(0);
  }
`;

export const LoadingDots = styled.span`
  display: inline-flex;
  gap: 4px;
  span {
    width: 6px;
    height: 6px;
    background: ${({ theme }) => theme.colors.text};
    border-radius: 50%;
    animation: ${pulse} 1s ease-in-out infinite;
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
`;

export const ResetButton = styled.button`
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

// Speaker Button for TTS
export const SpeakerButton = styled.button<{ $isPlaying?: boolean; $color?: string }>`
  position: absolute;
  top: ${({ theme }) => theme.spacing.xs};
  right: ${({ theme }) => theme.spacing.xs};
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ $isPlaying, $color, theme }) =>
    $isPlaying ? ($color || theme.colors.primary) + '33' : 'transparent'};
  border: 1px solid ${({ $isPlaying, $color, theme }) =>
    $isPlaying ? ($color || theme.colors.primary) : theme.colors.border};
  color: ${({ $isPlaying, $color, theme }) =>
    $isPlaying ? ($color || theme.colors.primary) : theme.colors.textMuted};
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  opacity: 0.7;

  &:hover {
    opacity: 1;
    background: ${({ $color, theme }) => ($color || theme.colors.primary) + '22'};
    border-color: ${({ $color, theme }) => $color || theme.colors.primary};
    color: ${({ $color, theme }) => $color || theme.colors.primary};
    transform: scale(1.1);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  &:active {
    transform: scale(0.95);
  }
`;

// Modal
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: 1000;
  animation: ${modalFadeIn} 0.2s ease;
`;

export const ModalPanel = styled.div<{ $color: string }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: 360px;
  width: 90%;
  z-index: 1001;
  animation: ${modalSlideUp} 0.25s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${({ $color }) => $color};
    border-radius: ${({ theme }) => theme.borderRadius.lg}
      ${({ theme }) => theme.borderRadius.lg} 0 0;
  }
`;

export const ModalCloseButton = styled.button`
  position: absolute;
  z-index: 1;
  top: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const ModalProfileImage = styled.div`
  width: 100%;
  aspect-ratio: 1;
  transform: scale(1.215);
  position: relative;
  overflow: hidden;
  margin: 3.8px auto ${({ theme }) => theme.spacing.xxl};
  
`;

export const ModalName = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const ModalTagline = styled.p<{ $color: string }>`
  font-size: 0.875rem;
  color: ${({ $color }) => $color};
  text-align: center;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const ModalBio = styled.p`
  font-size: 0.9375rem;
  white-space: pre-line;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const ModalBadges = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const Badge = styled.span<{ $color: string }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: ${({ $color }) => $color}22;
  color: ${({ $color }) => $color};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.75rem;
  font-weight: 600;
`;

export const ModalRoastStyle = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  text-align: center;
  white-space: pre-line;

  .label {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.textDim};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }

  .value {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
  }
`;
