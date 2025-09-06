import { customAlphabet } from 'nanoid';

export const pasteId = customAlphabet(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  8 // length
);