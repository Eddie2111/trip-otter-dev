import { Document } from 'mongoose';
import type { v4 as uuidv4 } from 'uuid';

export interface UserDocument extends Document {
  _id: string;
  serial: uuidv4;
  fullName: string;
  username: string;
  email: string;
  password: string;
  agreeToTerms: boolean;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  reputation: number;
  role: 'USER' | 'BUSINESS';
}
