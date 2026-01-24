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

const DEFAULT: Config = {
  baseSpeed: 30,
  jitter: 15,
  punctuationDelay: 150,
  typingIndicatorDuration: [600, 1600],
  interMessageDelay: 400,
};

const PUNCTUATION = '.!?,…。！？，';

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function charDelay(char: string, cfg: Config) {
  let d = cfg.baseSpeed + rand(-cfg.jitter, cfg.jitter);
  if (PUNCTUATION.includes(char)) d += cfg.punctuationDelay;
  if (char === '\n') d += cfg.punctuationDelay * 1.5;
  return Math.max(d, 10);
}

export function useSequentialTyping(
  messages: ParsedMessage[],
  options: Partial<Config> = {}
) {
  const cfg = { ...DEFAULT, ...options };
  const [rendered, setRendered] = useState<RenderedMessage[]>([]);
  const [typingFriend, setTypingFriend] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const idx = useRef(0);
  const charIdx = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const data = useRef<ParsedMessage[]>([]);

  const clear = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    clear();
    if (!messages.length) {
      setRendered([]);
      setTypingFriend(null);
      setDone(false);
      return;
    }

    data.current = messages;
    idx.current = 0;
    charIdx.current = 0;
    setDone(false);
    setRendered(messages.map(m => ({
      friendIndex: m.friendIndex,
      fullText: m.text,
      typedText: '',
      status: 'pending',
    })));

    const updateStatus = (i: number, status: TypingStatus, text?: string) => {
      setRendered(prev => prev.map((m, j) =>
        j === i ? { ...m, status, ...(text !== undefined && { typedText: text }) } : m
      ));
    };

    const typeChar = () => {
      const i = idx.current;
      const msg = data.current[i];
      if (!msg) return;

      const c = charIdx.current;
      if (c < msg.text.length) {
        charIdx.current++;
        updateStatus(i, 'typing', msg.text.slice(0, c + 1));
        timer.current = setTimeout(typeChar, charDelay(msg.text[c] || '', cfg));
      } else {
        updateStatus(i, 'complete');
        timer.current = setTimeout(nextMsg, cfg.interMessageDelay);
      }
    };

    const startTyping = () => {
      charIdx.current = 0;
      updateStatus(idx.current, 'typing');
      timer.current = setTimeout(typeChar, 50);
    };

    const showIndicator = () => {
      const msg = data.current[idx.current];
      if (!msg) return;
      setTypingFriend(msg.friendIndex);
      updateStatus(idx.current, 'typing-indicator');
      timer.current = setTimeout(startTyping, rand(cfg.typingIndicatorDuration[0], cfg.typingIndicatorDuration[1]));
    };

    const nextMsg = () => {
      idx.current++;
      if (idx.current >= data.current.length) {
        setTypingFriend(null);
        setDone(true);
        return;
      }
      showIndicator();
    };

    timer.current = setTimeout(showIndicator, 100);
    return clear;
  }, [messages, clear]);

  const reset = useCallback(() => {
    clear();
    setRendered([]);
    setTypingFriend(null);
    setDone(false);
  }, [clear]);

  return { renderedMessages: rendered, currentTypingFriendIndex: typingFriend, isComplete: done, reset };
}
