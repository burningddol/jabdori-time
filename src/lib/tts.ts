

export interface VoiceProfile {
  rate: number;
  pitch: number;
  volume: number;
  lang: string;
  nameHints?: string[]; //  voice gender
}


let voices: SpeechSynthesisVoice[] = [];
let currentUtterance: SpeechSynthesisUtterance | null = null;
let onEndCallback: (() => void) | null = null;

export function isSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function getVoices(): SpeechSynthesisVoice[] {
  return voices;
}

export function initVoices(onLoaded?: () => void): () => void {
  if (!isSupported()) return () => {};

  const load = () => {
    const available = window.speechSynthesis.getVoices();
    if (available.length > 0) {
      voices = available;
      onLoaded?.();
    }
  };

  load();
  window.speechSynthesis.onvoiceschanged = load;

  return () => {
    window.speechSynthesis.onvoiceschanged = null;
  };
}


export function pickVoice(
  availableVoices: SpeechSynthesisVoice[],
  profile: VoiceProfile
): SpeechSynthesisVoice | null {

  if (availableVoices.length === 0) return null;
  
  // 언어 선택
  const langVoices = availableVoices.filter(
    (v) => v.lang === profile.lang || v.lang.startsWith(profile.lang.split('-')[0])
  );
console.log(langVoices);
  if (langVoices.length === 0) {
    // 언어 없으면 걍 안해
    return null;
  }

  // 목소리 선택, 옵션중 가장빨리 발견 하는것
  if (profile.nameHints?.length) {
    const hintMatch = langVoices.find((v) =>
      profile.nameHints!.some((hint) =>
        v.name.toLowerCase().includes(hint.toLowerCase())
      )
    );
    if (hintMatch) return hintMatch;
  }
  
  return null;
}

export function speak(
  text: string,
  profile: VoiceProfile,
  onEnd?: () => void
): void {
  if (!isSupported()) return;

  stop(); // 다른거 종료

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = profile.rate;
  utterance.pitch = profile.pitch;
  utterance.volume = profile.volume;

  const voice = pickVoice(voices, profile);
  
  if (voice) {
    utterance.voice = voice;
  } else {
    stop();
    return alert("크롬은 남성보이스를 지원하지 않아요. EDGE로 가세여"); //보이스 없음
  }

  onEndCallback = onEnd ?? null;
  utterance.onend = () => {
    currentUtterance = null;
    onEndCallback?.();
    onEndCallback = null;
  };
  utterance.onerror = () => {
    currentUtterance = null;
    onEndCallback?.();
    onEndCallback = null;
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function stop(): void {
  if (!isSupported()) return;
  window.speechSynthesis.cancel();
  currentUtterance = null;
  onEndCallback = null;
}

export function isSpeaking(): boolean {
  return currentUtterance !== null;
}
