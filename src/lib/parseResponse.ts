import type { ParsedMessage } from '@/hooks/useSequentialTyping';

export function parseResponse(answer: string): ParsedMessage[] {
  const result: ParsedMessage[] = [];

  for (const line of answer.split('\n')) {
    if (!line.trim()) continue;

    const match = line.match(/^친구(\d):\s*(.+)$/);
    if (!match) continue;

    const friendNumber = Number(match[1]);
    if (friendNumber < 1 || friendNumber > 5) continue;

    result.push({
      friendIndex: friendNumber - 1,
      text: match[2].trim(),
    });
  }

  return result;
}
