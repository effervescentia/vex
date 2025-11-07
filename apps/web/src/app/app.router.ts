import { createRouter, defineRoute, param } from 'type-route';

export const { RouteProvider, useRoute, routes } = createRouter({
  home: defineRoute('/'),

  fingerprint: defineRoute('/fingerprint'),

  signup: defineRoute('/signup'),

  login: defineRoute('/login'),

  ownMemos: defineRoute('/memo'),

  newMemo: defineRoute('/memo/new'),

  memoDetails: defineRoute(
    {
      memoID: param.path.string,
    },
    (p) => `/memo/${p.memoID}`,
  ),

  editMemo: defineRoute(
    {
      memoID: param.path.string,
    },
    (p) => `/memo/${p.memoID}/edit`,
  ),

  feed: defineRoute('/feed'),
});
