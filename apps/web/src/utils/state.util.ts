import { atomWithStorage, createJSONStorage, unstable_withStorageValidator as withStorageValidator } from 'jotai/utils';
import type z from 'zod';

export const atomWithZodStorage = <T>(name: string, dto: z.ZodType<T>, defaultValue: T) =>
  atomWithStorage(
    name,
    defaultValue,
    withStorageValidator((value): value is T => dto.safeParse(value).success)(createJSONStorage()),
  );
