import { staticResourceAtom } from '@bltx/web';
import { AppNavigation } from '@web/app/app.navigation';
import { routes } from '@web/app/app.router';
import { client } from '@web/client';
import { getGeolocation } from '@web/utils/geolocation.util';
import { useAtomValue } from 'jotai';

export const feedAtom = staticResourceAtom(async () => {
  const geolocation = await getGeolocation();

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
