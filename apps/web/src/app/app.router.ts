import { createRouter, defineRoute, param } from 'type-route';

export const { RouteProvider, useRoute, routes } = createRouter({
  home: defineRoute('/'),

  fingerprint: defineRoute('/fingerprint'),

  signup: defineRoute('/signup'),

  login: defineRoute('/login'),

  ownMemos: defineRoute('/memos'),

  newMemo: defineRoute('/memo/new'),

  memoDetails: defineRoute(
    {
      memoID: param.path.string,
    },
    (p) => `/memo/${p.memoID}`,
  ),
});
