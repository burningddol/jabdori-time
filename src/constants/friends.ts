import yura from '@/assets/yuah.png';
import suho from '@/assets/suho.png';
import jiwoo from '@/assets/jiwoo.png';
import doah from '@/assets/doah.png';
import donggu from '@/assets/donggu.png';
import type { Friend } from '@/types';

export const FRIENDS: Friend[] = [
  {
  profile: yura,
  name: `차유라`,
  tagline: '걸그룹 메인보컬',
  bio: `말투는 항상 상냥하고 팬서비스가 몸에 밴 타입이지만, 웃으면서도 은근히 가장 아픈 부분을 정확히 찌른다.\n \n 치열하게 살아온 시간들이 지금의 그녀를 만들었고, 그 경험에서 나오는 말 한마디는 가볍지 않다.`,
  badges: ['ENFP', '활기찬'],
  roastStyle: '밝게 공감해주는 듯하다가, \n마지막에 정곡을 찌르는 한마디를 던진다.',
},
{
  profile: suho,
  name: '김수호',
  tagline: '5개국어 통역사',
  bio: '항상 이성적으로 사고하며 감정에 쉽게 흔들리지 않는다.\n 위로보다는 정확한 의미 전달을 중시하고, 말에 불필요한 온기를 섞지 않는다.\n\n차분한 태도로 상황을 정리하듯 말하며, 그의 솔직함은 때로 상대를 불편하게 만들 만큼 날카롭다.',
  badges: ['INTJ', '현실주의'],
  roastStyle: '담담한 말투로 핵심만 짚는다.\n 부드럽지만 회피할 수 없는 직설이 상대를 조용히 압박한다.',
},
{
  profile: jiwoo,
  name: '임지우',
  tagline: 'FE 개발자',
  bio: '주인공과 오랜 시간을 함께한 친구.\n 기본적으로는 다정하고 이해심이 깊지만, 반복되는 변명에는 더 이상 봐주지 않는다.\n \n진심으로 잘되길 바라기에 \n필요한 말은 꼭 한다.',
  badges: ['ISFJ', '친근함'],
  roastStyle: '보호자 같은 말투로 다독이다가도,\n 선을 넘으면 단호하게 현실을 짚어준다.',
},
{
  profile: doah,
  name: '김도아',
  tagline: '생물학 박사',
  bio: '말투는 시크하고 감정을 쉽게 \n 드러내지 않는다.\n 스스로에게도 타인에게도 기준이 높으며,\n 시간을 낭비하는 태도를 가장 싫어한다.\n \n노력하지 않는 사람에게는 냉정하다.',
  badges: ['ENTJ', '차가운'],
  roastStyle: '할 일을 미루는 태도를 가치 없는\n 행동으로 규정하며,\n 거리낌 없이 경멸을 드러낸다.',
},
{
  profile: donggu,
  name: '강동구',
  tagline: '천재 개발자',
  bio: '방구석 히키코모리 천재 개발자.\n 말투는 건조하고 감정 표현이 거의 없다.\n \n인간관계보다 문제 해결과 논리에 \n더 큰 흥미를 느낀다.',
  badges: ['INTP', '분석적'],
  roastStyle: '감정적 공감 없이 오직 논리와 데이터로만 상대의 행동을 해부한다.',
}

];

export const FRIEND_COLORS = ['#e7f59b', '#9da5eb', '#adb65b', '#cea0f3', '#d4ddd6'] as const;

import type { VoiceProfile } from '@/lib/tts';

export const VOICE_PROFILES: VoiceProfile[] = [
  // 차유라
  { rate: 1.45, pitch: 2.5, volume: 0.8, lang: 'ko-KR', nameHints: ['female', 'woman', '여성', '여자', 'heami']},
  // 김수호
  { rate: 1.25, pitch: 0.2, volume: 0.8, lang: 'ko-KR', nameHints: ['male', 'man', '남성', 'InJoon'] },
  // 임지우
  { rate: 1.0, pitch: 1.4, volume: 0.8, lang: 'ko-KR', nameHints: ['female', 'woman', '여성', 'heami', 'sunhi']},
  // 김도아
  { rate: 0.85, pitch: 0.9, volume: 0.8, lang: 'ko-KR', nameHints: ['female', 'woman', '여성', 'heami', 'InJin']},
  // 강동구
  { rate: 1.1, pitch: 5.3, volume: 0.8, lang: 'ko-KR', nameHints: ['male', 'man', '남성', 'InJoon'] },
];
