import { model, models, Schema } from 'mongoose';
import { PostDocument } from '@/types/post.d';

const postSchema = new Schema<PostDocument>(
  {
    content: {
      type: String,
      required: true,
      maxlength: [500, 'Post content must be less than 500 characters'],
    },
    mediaUrl: {
      type: String,
      required: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Post ?? model<PostDocument>('Post', postSchema);