export interface IMessage {
  content: string;
  recipientId: string;
  senderId: string;
  timestamp: number;
  isSelf: boolean;
  status: 'sent' | 'delivered' | 'read' | 'failed'
}
