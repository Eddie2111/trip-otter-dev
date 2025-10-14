export interface UserDataOptimized {
  _id: string;
  username?: string;
  fullName?: string;
  profileImage?: string;
  profile: {
    postsCount: number;
    commentsCount: number;
    followersCount: number;
    followingCount: number;
    createdAt: Date;
    updatedAt: Date;
    _id: number;
  };
  [key: string]: any;
}