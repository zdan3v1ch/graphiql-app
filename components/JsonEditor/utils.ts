import { Diagnostic } from '@codemirror/lint';

export function validateJson(code?: string): Diagnostic[] {
  if (!code) {
    return [];
  }

  try {
    JSON.parse(code);

    return [];
  } catch (err) {
    const error = err as Error;
    const message = error.message;
    const positionMatch = message.match(/position (\d+)/);
    const pos = positionMatch ? parseInt(positionMatch[1], 10) : 0;

    return [
      {
        from: pos,
        to: pos + 1,
        severity: 'error',
        message: error.message,
      },
    ];
  }
}
