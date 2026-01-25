import { useState, useEffect, useCallback } from 'react';
import * as tts from '@/lib/tts';
import { VOICE_PROFILES } from '@/constants/friends';

interface UseSpeechSynthesisReturn {
  speak: (text: string, friendIndex: number, messageId: number) => void;
  stop: () => void;
  playingMessageId: number | null;
  isSupported: boolean;
  isReady: boolean;
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [playingMessageId, setPlayingMessageId] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSupported] = useState(() => tts.isSupported());

  // Initialize voices
  useEffect(() => {
    if (!isSupported) return;

    const cleanup = tts.initVoices(() => setIsReady(true));

    // Check if already loaded
    if (tts.getVoices().length > 0) {
      setIsReady(true);
    }

    return () => {
      cleanup();
      tts.stop();
    };
  }, [isSupported]);

  const stop = useCallback(() => {
    tts.stop();
    setPlayingMessageId(null);
  }, []);

  const speak = useCallback(
    (text: string, friendIndex: number, messageId: number) => {
      // Toggle off if same message
      if (playingMessageId === messageId) {
        stop();
        return;
      }

      stop();

      const profile = VOICE_PROFILES[friendIndex] ?? VOICE_PROFILES[0];
      setPlayingMessageId(messageId);
      tts.speak(text, profile, () => setPlayingMessageId(null));
      
    },
    [playingMessageId, stop]
  );

  return { speak, stop, playingMessageId, isSupported, isReady };
}
