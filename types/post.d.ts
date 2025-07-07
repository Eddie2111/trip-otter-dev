import { Document } from 'mongoose';
import { UserDocument } from './user.d';

export interface Post {
  content: string;
  mediaUrl?: string;
  owner: string | UserDocument;
  likesCount?: number;
}

export interface PostDocument extends Post, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}