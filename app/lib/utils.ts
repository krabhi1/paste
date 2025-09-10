import { customAlphabet } from "nanoid";

export const pasteId = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  8, // length
);

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const IS_DEV = process.env.NODE_ENV === "development";
export const IS_TEST = process.env.NODE_ENV === "test";
