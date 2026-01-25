'use client';
import buldak from "@/assets/buldak.png";
import tea from "@/assets/tea.png";
import Image from "next/image";
import type { ConfessionFormData } from '@/lib/validation';
import {
  Form,
  FormGroup,
  Label,
  Input,
  TextArea,
  ToneSelector,
  ToneOption,
  ErrorText,
  SubmitButton,
  LoadingDots,
} from './styles';

type FormErrors = Partial<Record<keyof ConfessionFormData, string>>;

interface Props {
  formData: ConfessionFormData;
  errors: FormErrors;
  isLoading: boolean;
  onChange: (field: keyof ConfessionFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ConfessionForm({ formData, errors, isLoading, onChange, onSubmit }: Props) {
  return (
    <Form onSubmit={onSubmit}>
      <FormGroup>
        <Label>이름</Label>
        <Input
          placeholder="ex) 김춘식"
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          $error={!!errors.name}
        />
        {errors.name && <ErrorText>{errors.name}</ErrorText>}
      </FormGroup>

      <FormGroup>
        <Label>당신의 할 일이 무엇이었나요?</Label>
        <TextArea
          placeholder="ex) 코딩강의 5개 듣기"
          value={formData.task}
          onChange={(e) => onChange('task', e.target.value)}
          $error={!!errors.task}
        />
        {errors.task && <ErrorText>{errors.task}</ErrorText>}
      </FormGroup>

      <FormGroup>
        <Label>오늘의 변명은 무엇이었나요?</Label>
        <TextArea
          placeholder="ex) 음.. 조금 피곤하기도 하고,, 웹툰이 너무 재미있었어요"
          value={formData.excuse}
          onChange={(e) => onChange('excuse', e.target.value)}
          $error={!!errors.excuse}
        />
        {errors.excuse && <ErrorText>{errors.excuse}</ErrorText>}
      </FormGroup>

      <FormGroup>
        <Label>잡도리의 강도를 정해주세요</Label>
        <ToneSelector>
          <ToneOption $selected={formData.tone === 'spicy'}>
            <input
              type="radio"
              name="tone"
              checked={formData.tone === 'spicy'}
              onChange={() => onChange('tone', 'spicy')}
            />
            <Image src={buldak} width={50} height={50} alt="불닭볶음면"/> 무자비 불닭맛
          </ToneOption>
          <ToneOption $selected={formData.tone === 'mild'}>
            <input
              type="radio"
              name="tone"
              checked={formData.tone === 'mild'}
              onChange={() => onChange('tone', 'mild')}
            />
            <Image src={tea} width={50} height={50} alt="불닭볶음면"/> 잔잔한 티타임
          </ToneOption>
        </ToneSelector>
      </FormGroup>

      <SubmitButton type="submit" $loading={isLoading}>
        {isLoading ? (
          <LoadingDots>
            <span />
            <span />
            <span />
          </LoadingDots>
        ) : (
          '잡도리 타임'
        )}
      </SubmitButton>
    </Form>
  );
}
