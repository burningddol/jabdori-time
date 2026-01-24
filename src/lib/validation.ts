import { z } from 'zod';

export const confessionSchema = z.object({
  name: z
    .string()
    .min(1, '이름을 입력해주세요.')
    .max(20, '이름은 20자 이하로 입력해주세요.'),
  task: z
    .string()
    .min(5, '최소 5글자 이상 작성해주세요. 잡도리 할 맛이 안납니다.')
    .max(200, '200글자 미만으로 작성해주세요.'),
  excuse: z
    .string()
    .min(10, '핑계가 너무 조촐하군요. 잡도리 할 맛 나게 더 적어주세요.')
    .max(500, '변명을 적으라 한것이지, 인생사를 적으라 한 건 아닙니다.'),
  tone: z.enum(['spicy', 'mild'], {
    message: '잡도리 강도를 골라주세요.',
  }),
});

export type ConfessionFormData = z.infer<typeof confessionSchema>;
