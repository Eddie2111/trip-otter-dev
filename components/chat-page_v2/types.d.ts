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
}