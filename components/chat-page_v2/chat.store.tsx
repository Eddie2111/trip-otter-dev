import { atom, PreinitializedWritableAtom } from 'nanostores';
import { Socket } from 'socket.io-client';
import { IMessage } from './constants/types';

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

export const $chatSocket = atom<Socket | null>(null);

export const $userLayout = atom<string>("");

export const $currentChatHistory = atom<IMessage[]>([]);

export const $isTyping = atom<boolean> (false);

export type IMessageStoreType = PreinitializedWritableAtom<IMessage[]> & object;