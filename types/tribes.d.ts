import { Document, Types } from "mongoose";

export type TribeCategory =
  | "JOURNEY"
  | "LOCATION"
  | "COMMUNITY"
  | "FOOD"
  | "BIKERS"
  | "CYCLISTS"
  | "LONG_TRAVEL"
  | "ABROAD";

export type TribePrivacy = "PUBLIC" | "PRIVATE";

export interface TribeDocument extends Document{
  _id: string;
  serial: string;
  description?: string;
  category: TribeCategory;
  tags: string[];
  coverImage?: string;
  profileImage?: string;
  name: string;
  users: Types.ObjectId[];
  posts: Types.ObjectId[];
  createdBy: Types.ObjectId;
  privacy: TribePrivacy;
  createdAt: string;
  updatedAt: string;
}

export interface ITribePlain {
  _id: string;
  serial: string;
  description?: string;
  category: TribeCategory;
  tags: string[];
  coverImage?: string;
  profileImage?: string;
  name: string;
  users?: string[];
  posts?: string[];
  createdBy: Types.ObjectId;
  privacy: TribePrivacy;
  createdAt: string;
  updatedAt: string;
}

