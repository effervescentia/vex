import { dynamicResourceAtom, staticResourceAtom } from '@bltx/web';
import { client } from '@web/client';

export const memoAtom = dynamicResourceAtom((memoID) => client().memo({ memoID }).get());

export const ownMemosAtom = staticResourceAtom(() => client().memo.get());
