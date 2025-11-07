import { staticResourceAtom } from '@bltx/web';
import { env } from '@web/app/app.env';
import { AppNavigation } from '@web/app/app.navigation';
import { routes } from '@web/app/app.router';
import { client } from '@web/client';
import { useAtomValue } from 'jotai';

export const feedAtom = staticResourceAtom(async () => {
  const geolocation = await new Promise<GeolocationPosition>((resolve, reject) =>
    window.navigator.geolocation.getCurrentPosition(resolve, reject, { maximumAge: env.get().GEOLOCATION_TTL }),
  );

  return client().memo.feed.post({
    geolocation: [geolocation.coords.longitude, geolocation.coords.latitude],
    distance: 10,
  });
});

export const Feed: React.FC = () => {
  const memos = useAtomValue(feedAtom);

  if (memos.state !== 'hasData') return null;

  return (
    <div>
      <AppNavigation />
      {memos.data.map((memo) => (
        <div key={memo.id}>
          <p>{memo.text?.content}</p>
          <a {...routes.memoDetails({ memoID: memo.id }).link}>details</a>
        </div>
      ))}
    </div>
  );
};
