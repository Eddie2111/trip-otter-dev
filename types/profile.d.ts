import { Document } from 'mongoose';
import { UserDocument } from './user.d';
import { PostDocument } from './post.d';
import { CommentDocument } from './comment.d';
import { LikeDocument } from './like.d';
import { ReportDocument } from './report';

export interface ProfileDocument extends Document {
  user: Types.ObjectId;
  followers: UserDocument['_id'][];
  following: UserDocument['_id'][];
  posts: PostDocument['_id'][];
  comments: CommentDocument['_id'][];
  likes: LikeDocument['_id'][];
  report: ReportDocument['_id'][];
}