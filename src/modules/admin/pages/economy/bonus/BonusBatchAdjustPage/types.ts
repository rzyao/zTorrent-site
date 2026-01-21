export type BatchItem = {
  userId: string;
  delta: string;
  reason: string;
  externalRef?: string;
};

export type ResultItem = {
  ok: boolean;
  userId: string;
  delta?: string;
  error?: string;
};
