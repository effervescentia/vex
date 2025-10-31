import type { Treaty } from '@elysiajs/eden';

export const unpack = <T>(response: Treaty.TreatyResponse<{ 200: T }>) => {
  if (response.error) throw response.error;
  return response.data;
};
