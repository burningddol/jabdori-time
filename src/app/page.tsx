'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled, { keyframes } from 'styled-components';
import Link from 'next/link';

const SPEECH_BUBBLES = [
  "공부하기로 해놓고 또 안 했다구요?!",
  "할 일을 미루고 아직도 변명 중이라구요!?",
  "자백을 털어놓을 준비가 되셨나요?",
  "사실대로 말해봐요 ",
];

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50% { transform: translateY(-8px) rotate(2deg); }
`;

const glitch = keyframes`
  0%, 90%, 100% { transform: translate(0) skew(0deg); }
  92% { transform: translate(-2px, 1px) skew(1deg); }
  94% { transform: translate(2px, -1px) skew(-1deg); }
  96% { transform: translate(-1px, 2px) skew(0.5deg); }
  98% { transform: translate(1px, -2px) skew(-0.5deg); }
`;

const fadeSlideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(213, 107, 255, 0.3); }
  50% { box-shadow: 0 0 30px rgba(213, 107, 255, 0.5); }
`;

const mockingShake = keyframes`
  0%, 100% { transform: translateX(0) scale(1.05); }
  25% { transform: translateX(-3px) rotate(-1deg) scale(1.05); }
  75% { transform: translateX(3px) rotate(1deg) scale(1.05); }
`;

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  position: relative;
  overflow: hidden;
`;

const BackgroundGlow = styled.div`
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(148, 22, 197, 0.082) 0%, transparent 70%);
  pointer-events: none;
`;

const Logo = styled.h1`
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  animation: ${float} 4s ease-in-out infinite, ${glitch} 8s ease-in-out infinite;
  cursor: default;
  user-select: none;

  span {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const BubblesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  width: 100%;
  max-width: 400px;
`;

const SpeechBubble = styled.div<{ $delay: number; $visible: boolean }>`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textMuted};
  position: relative;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  animation: ${({ $visible }) => ($visible ? fadeSlideUp : 'none')} 0.5s ease forwards;
  animation-delay: ${({ $delay }) => $delay}ms;

  &::before {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 24px;
    width: 16px;
    height: 16px;
    background: ${({ theme }) => theme.colors.surface};
    border-right: 1px solid ${({ theme }) => theme.colors.border};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    transform: rotate(45deg);
  }
`;

const CTAButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.25rem;
  font-weight: 700;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xxl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: all ${({ theme }) => theme.transitions.fast};
  animation: ${pulseGlow} 2s ease-in-out infinite;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
    animation: ${mockingShake} 0.3s ease-in-out infinite, ${pulseGlow} 2s ease-in-out infinite;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textDim};
  font-size: 0.875rem;
  margin-top: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

export default function LandingPage() {
  const router = useRouter();
  const [visibleBubbles, setVisibleBubbles] = useState<number[]>([]);

  useEffect(() => {
    SPEECH_BUBBLES.forEach((_, index) => {
      setTimeout(() => {
        setVisibleBubbles((prev) => [...prev, index]);
      }, 50 + index * 600);
    });
  }, []);



  return (
    <Container>
      <BackgroundGlow />

      <Logo>
        JABDORI TIME<span>!</span>
      </Logo>

      <BubblesContainer> 
        {SPEECH_BUBBLES.map((text, index) => (
          <SpeechBubble
            key={index}
            $delay={0}
            $visible={visibleBubbles.includes(index)}
          >
            {text}
          </SpeechBubble>
        ))}
      </BubblesContainer>

      <Link href="/confession" prefetch>
        <CTAButton>
          잡도리 타임
        </CTAButton>
      </Link> 

      <Subtitle>
        당신의 친절한 5명의 친구가 기다리고 있어요
      </Subtitle>
    </Container>
  );
}
