import { App } from './app/app.module';

App.use((app) => {
  return app.listen(app.decorator.env.PORT);
});
