import { useState, useEffect, useRef, useCallback } from 'react';

export interface ParsedMessage {
  friendIndex: number;
  text: string;
}

export type TypingStatus = 'pending' | 'typing-indicator' | 'typing' | 'complete';

export interface RenderedMessage {
  friendIndex: number;
  fullText: string;
  typedText: string;
  status: TypingStatus;
}

interface Config {
  baseSpeed: number;
  jitter: number;
  punctuationDelay: number;
  typingIndicatorDuration: [number, number];
  interMessageDelay: number;
}

const DEFAULT_CONFIG: Config = {
  baseSpeed: 30,
  jitter: 15,
  punctuationDelay: 150,
  typingIndicatorDuration: [600, 1600],
  interMessageDelay: 400,
};

const PUNCTUATION = '.!?,…。！？，';

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getCharDelay(char: string, cfg: Config): number {
  let delay = cfg.baseSpeed + rand(-cfg.jitter, cfg.jitter);
  if (PUNCTUATION.includes(char)) delay += cfg.punctuationDelay;
  if (char === '\n') delay += cfg.punctuationDelay * 1.5;
  return Math.max(delay, 10);
}

export function useSequentialTyping(
  messages: ParsedMessage[],
  options: Partial<Config> = {}
) {
  const [rendered, setRendered] = useState<RenderedMessage[]>([]);
  const [typingFriend, setTypingFriend] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cfgRef = useRef<Config>({ ...DEFAULT_CONFIG, ...options });

  useEffect(() => {
    cfgRef.current = { ...DEFAULT_CONFIG, ...options };
  }, [options]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    clearTimer();

    if (!messages.length) {
      setRendered([]);
      setTypingFriend(null);
      setDone(false);
      return;
    }

    const cfg = cfgRef.current;
    let msgIndex = 0;
    let charIndex = 0;

    setDone(false);
    setRendered(
      messages.map((m) => ({
        friendIndex: m.friendIndex,
        fullText: m.text,
        typedText: '',
        status: 'pending' as TypingStatus,
      }))
    );

    const updateMessage = (index: number, status: TypingStatus, typedText?: string) => {
      setRendered((prev) =>
        prev.map((m, i) =>
          i === index
            ? { ...m, status, ...(typedText !== undefined && { typedText }) }
            : m
        )
      );
    };

    const typeNextChar = () => {
      const msg = messages[msgIndex];
      if (!msg) return;

      if (charIndex < msg.text.length) {
        const char = msg.text[charIndex];
        charIndex++;
        updateMessage(msgIndex, 'typing', msg.text.slice(0, charIndex));
        timerRef.current = setTimeout(typeNextChar, getCharDelay(char, cfg));
      } else {
        updateMessage(msgIndex, 'complete');
        timerRef.current = setTimeout(advanceToNextMessage, cfg.interMessageDelay);
      }
    };

    const startTypingMessage = () => {
      charIndex = 0;
      updateMessage(msgIndex, 'typing');
      timerRef.current = setTimeout(typeNextChar, 50);
    };

    const showTypingIndicator = () => {
      const msg = messages[msgIndex];
      if (!msg) return;

      setTypingFriend(msg.friendIndex);
      updateMessage(msgIndex, 'typing-indicator');

      const indicatorDuration = rand(
        cfg.typingIndicatorDuration[0],
        cfg.typingIndicatorDuration[1]
      );
      timerRef.current = setTimeout(startTypingMessage, indicatorDuration);
    };

    const advanceToNextMessage = () => {
      msgIndex++;
      if (msgIndex >= messages.length) {
        setTypingFriend(null);
        setDone(true);
        return;
      }
      showTypingIndicator();
    };

    timerRef.current = setTimeout(showTypingIndicator, 100);

    return clearTimer;
  }, [messages, clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    setRendered([]);
    setTypingFriend(null);
    setDone(false);
  }, [clearTimer]);

  return {
    renderedMessages: rendered,
    currentTypingFriendIndex: typingFriend,
    isComplete: done,
    reset,
  };
}
