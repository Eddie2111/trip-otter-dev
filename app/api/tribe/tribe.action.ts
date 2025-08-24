import { z } from 'zod';
import tribesSchema from "@/utils/schema/tribes-schema";

import { ITribePlain } from "@/types/tribes.d";
import { runDBOperation } from '@/lib/useDB';

export const TribeCategorySchema = z.enum([
  "JOURNEY",
  "LOCATION",
  "COMMUNITY",
  "FOOD",
  "BIKERS",
  "CYCLISTS",
  "LONG_TRAVEL",
  "ABROAD",
]);

export const TribePrivacySchema = z.enum(["PUBLIC", "PRIVATE"]);

export const TribeValidationSchema = z.object({
  description: z
    .string()
    .max(4096, "Description must be less than 4096 characters")
    .optional(),
  category: TribeCategorySchema.default("COMMUNITY"),
  tags: z.array(z.string()).default([]),
  coverImage: z.string().url().optional(),
  profileImage: z.string().url().optional(),
  name: z
    .string()
    .min(2, "Group name must be at least 2 characters")
    .max(50, "Group name must be less than 50 characters"),
  users: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).default([]),
  posts: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).default([]),
  createdBy: z.string().regex(/^[0-9a-fA-F]{24}$/),
  privacy: TribePrivacySchema.default("PUBLIC"),
});

export async function createTribeAction(data: ITribePlain) { 
    try {
      const tribe = TribeValidationSchema.parse(data);
      const tribePayload = await runDBOperation(async () => {
        const tribeLoad = new tribesSchema(tribe);
        await tribeLoad.save();
        return tribeLoad;
      });
      return tribePayload;
    } catch (error) {
      const errResponse = error as unknown as { message: string; code: number };
      return errResponse;
    }
}

export async function getTribe(id: string) { 
  try {
    const tribe = await runDBOperation(async () => {
      const data = await tribesSchema.findById(id).lean().exec();
      console.log(data);
      return data;
    })
    return tribe;
  } catch (error) {
    const errResponse = error as unknown as { message: string; code: number };
    return errResponse;
  }
}

export async function getTribeBySerial(serial: string) { 
  try {
    const tribe = await runDBOperation(async () => {
      const data = await tribesSchema.find({ serial }).lean().exec();
      return data;
    })
    return tribe;
  } catch (error) {
    const errResponse = error as unknown as { message: string; code: number };
    return errResponse;
  }
}

export async function getTribes(page: string, limit: string) {
  try {
    const _page = parseInt(page)-1;
    const _limit = parseInt(limit);
    const tribe = await runDBOperation(async () => { 
      return await tribesSchema
      .find()
      .limit(_limit)
      .skip(_page * _limit)
      .select("-posts -users")
      .lean()
      .exec();
    })
    return tribe;
  } catch (error) {
    const errResponse = error as unknown as { message: string; code: number };
    return errResponse;
  }
}

export async function getTribesByCategory(category: string, page: string, limit: string) { 
  try {
    const _page = parseInt(page);
    const _limit = parseInt(limit)
    const tribe = await runDBOperation(async () => {
      return await tribesSchema
        .find({ category })
        .limit(_limit)
        .skip(_page * _limit)
        .select("-posts -users")
        .lean()
        .exec();
    });
    return tribe;
  } catch (error) {
    const errResponse = error as unknown as { message: string; code: number };
    return errResponse;
  }
}

export async function getTribesByTag(tag: string, page: string, limit: string) { 
  try {
    const _page = parseInt(page);
    const _limit = parseInt(limit);
    const tribe = await runDBOperation(async () => {
      return await tribesSchema
        .find({ tags: { $in: [tag] } })
        .limit(_limit)
        .skip(_page * _limit)
        .select("-posts -users")
        .lean()
        .exec();
    });
    return tribe;
  } catch (error) {
    const errResponse = error as unknown as { message: string; code: number };
    return errResponse;
  }
}


export async function getTribePosts(id: string, page: string, limit: string) { 
  try {
    const _page = parseInt(page);
    const _limit = parseInt(limit);
    const tribe = await runDBOperation(async () => {
      return await tribesSchema
        .findById(id)
        .populate({
          path: "posts",
          options: {
            skip: _page * _limit,
            limit: _limit,
          },
        })
        .select("-users")
        .lean()
        .exec();
    });
    return tribe;
  } catch (error) {
    const errResponse = error as unknown as { message: string; code: number };
    return errResponse;
  }
}

export async function getTribeMembers(id: string, page: string, limit: string) {
  try {
    const _page = parseInt(page);
    const _limit = parseInt(limit);
    const tribe = await runDBOperation(async () => {
      return await tribesSchema
        .findById(id)
        .populate({
          path: "users",
        })
        .skip(_page * _limit)
        .limit(_limit)
        .lean()
        .exec();
    });
    return tribe;
  } catch (error) {
    const errResponse = error as unknown as { message: string; code: number };
    return errResponse;
  }
}

export async function getUsersTribe(id: string, page: string, limit: string) { 
  // gets tribes created by users and member of
  try {
    const _page = parseInt(page);
    const _limit = parseInt(limit)
    const tribe = await runDBOperation(async () => {
      return await tribesSchema
        .find({ $or: [{ createdBy: id }, { users: { $in: [id] } }] })
        .limit(_limit)
        .skip(_page * _limit)
        .select("-posts -users")
        .lean()
        .exec();
    });
    return tribe;
  } catch (error) {
    const errResponse = error as unknown as { message: string; code: number };
    return errResponse;
  }
}

export async function updateTribe(id: string, data: ITribePlain) { 
  try {
    const tribe = await runDBOperation(async () => {
      return await tribesSchema.findByIdAndUpdate(id, data, { new: true });
    });
    return tribe;
  } catch (error) {
    const errResponse = error as unknown as { message: string; code: number };
    return errResponse;
  }
}

export async function deleteTribeAction(id: string) {
  try {
    const tribe = await runDBOperation(async () => {
      return await tribesSchema.findByIdAndDelete(id);
    });
    return tribe;
  } catch (error) {
    const errResponse = error as unknown as { message: string; code: number };
    return errResponse;
  }
}
