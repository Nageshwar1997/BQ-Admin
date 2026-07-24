import { parseData, stringifyData } from '@beautinique/shared-utils';
import CryptoJS from 'crypto-js';

import envs from '@/envs';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export const encryptData = <T extends object | string>(data: T): string => {
  const stringData = typeof data === 'string' ? data : stringifyData<T>(data);

  const encrypted = CryptoJS.AES.encrypt(stringData, envs.encryption_secret_key);
  return encrypted.toString();
};

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export const decryptData = <T = unknown>(encryptedData: string | null): T | null => {
  if (!encryptedData) return null;

  const bytes = CryptoJS.AES.decrypt(encryptedData, envs.encryption_secret_key);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);

  try {
    return parseData<T>(decrypted);
  } catch {
    return (decrypted as T) || null;
  }
};
