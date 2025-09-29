import { atom } from 'nanostores';

export const $isConnected = atom<boolean>(false);
export const $userLoggedIn = atom<boolean>(false);

export const $error = atom<string>('');

export function setErrorStore(message: string, duration = 5000) {
  $error.set(message);
  if (message) {
    setTimeout(() => {
      $error.set('');
    }, duration);
  }
}

export const $userLayout = atom<string>("");
