import { dynamicResource, staticResource } from '@bltx/web';
import { client } from '@web/client';

export const memoAtom = dynamicResource((memoID) => client().memo({ memoID }).get());

export const ownMemosAtom = staticResource(() => client().memo.get());
