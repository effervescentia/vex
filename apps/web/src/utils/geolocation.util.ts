import { env } from '@web/app/app.env';

export const getGeolocation = () =>
  new Promise<GeolocationPosition>((resolve, reject) =>
    window.navigator.geolocation.getCurrentPosition(resolve, reject, { maximumAge: env.get().GEOLOCATION_TTL }),
  );
