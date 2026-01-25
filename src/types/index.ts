import type { StaticImageData } from 'next/image';

export interface Friend {
  profile: StaticImageData;
  name: string;
  tagline: string;
  bio: string;
  badges: string[];
  roastStyle: string;
}

export type FriendIndex = 0 | 1 | 2 | 3 | 4;

export type Tone = 'spicy' | 'mild';

export interface ConfessionInput {
  name: string;
  task: string;
  excuse: string;
  tone: Tone;
}
