import { Document } from 'mongoose';
import { UserDocument } from './user.d';

export interface Post {
  serial: string;
  image: string[];
  likes: UserDocument[];
  caption: string;
  location: string;
  owner: UserDocument;
  comments: Comment[];
}

export interface PostDocument extends Post, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}