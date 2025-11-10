import { staticResourceAtom } from '@bltx/web';
import { AppNavigation } from '@web/app/app.navigation';
import { routes } from '@web/app/app.router';
import { client } from '@web/client';
import { getGeolocation } from '@web/utils/geolocation.util';
import { useAtom } from 'jotai';

export const feedAtom = staticResourceAtom(async () => {
  const geolocation = await getGeolocation();

  return client().memo.feed.post({
    geolocation: [geolocation.coords.longitude, geolocation.coords.latitude],
    distance: 10,
  });
});

export const Feed: React.FC = () => {
  const [memos, refreshMemos] = useAtom(feedAtom);

  const toggleBoost = (memoID: string, boosted: boolean) => async () => {
    await (boosted ? client().memo({ memoID }).boost.delete() : client().memo({ memoID }).boost.put());
    refreshMemos();
  };

  if (memos.state !== 'hasData') return null;

  return (
    <div>
      <AppNavigation />
      {memos.data.map((memo) => (
        <div key={memo.id}>
          <p>{memo.text?.content}</p>
          <a {...routes.memoDetails({ memoID: memo.id }).link}>details</a>
          <label>
            <input type="checkbox" checked={memo.boosted} onChange={toggleBoost(memo.id, memo.boosted)} />
            boosted
          </label>
        </div>
      ))}
    </div>
  );
};
