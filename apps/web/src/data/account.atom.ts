import { atom } from 'jotai';

export interface Account {
  id: string;
  aliases: string[];
}

export const accountAtom = atom(null as Account | null);
