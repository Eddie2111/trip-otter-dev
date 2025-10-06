import { atom } from 'nanostores';
import { Socket } from 'socket.io-client';

interface IMessage {
  content: string;
  recipientId: string;
  senderId: string;
  timestamp: number;
}

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
