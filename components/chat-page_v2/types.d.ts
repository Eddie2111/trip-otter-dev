export interface ICurrentChatHistoryProps {
  chats: IMessage[];
  messageSender: (message: string) => void;
  sender: {
    _id: string;
    fullName: string;
    username: string;
    profileImage: string;
  }
  recipientId: string;
  senderId: string;
  userOnArea: string;
}

export interface IMessageVisibility {
  self: boolean;
  all: boolean;
}

export interface ILatestMessage {
  _id: string;
  timestamp: number;
  content: string;
  senderId: string;
  recipientId: string;
  global: boolean;
  visibility: IMessageVisibility;
  status: 'delivered' | string;
  reports: any[];
  serial: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  contactId: string;
}

export interface IContactInfo {
  id: string;
  fullName: string;
  profileImage?: string;
}

export interface IConversationPayload {
  latestMessage: ILatestMessage;
  lastMessageAt: number;
  contactId: string;
  contact: IContactInfo;
}