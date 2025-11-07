import { routes } from './app.router';

export const AppNavigation: React.FC = () => (
  <nav>
    <ul>
      <li>
        <a {...routes.feed().link}>feed</a>
      </li>
      <li>
        <a {...routes.ownMemos().link}>memos</a>
      </li>
      <li>
        <a {...routes.newMemo().link}>new memo</a>
      </li>
    </ul>
  </nav>
);
