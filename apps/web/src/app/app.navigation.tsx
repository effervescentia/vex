import { routes } from './app.router';

export const AppNavigation: React.FC = () => (
  <nav>
    <ul>
      <li>
        <a {...routes.ownPosts().link}>posts</a>
      </li>
      <li>
        <a {...routes.newPost().link}>new post</a>
      </li>
    </ul>
  </nav>
);
