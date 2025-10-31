import { createRouter, defineRoute, param } from 'type-route';

export const { RouteProvider, useRoute, routes } = createRouter({
  home: defineRoute('/'),

  fingerprint: defineRoute('/fingerprint'),

  signup: defineRoute('/signup'),

  login: defineRoute('/login'),

  ownPosts: defineRoute('/posts'),

  newPost: defineRoute('/post/new'),

  postDetails: defineRoute(
    {
      postID: param.path.string,
    },
    (p) => `/post/${p.postID}`,
  ),
});
