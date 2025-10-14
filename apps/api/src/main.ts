import { App } from './app/app.module';

App.use((app) => {
  console.log(app.decorator.env.POSTGRES_PASSWORD)

  return app.listen(app.decorator.env.PORT);
});
