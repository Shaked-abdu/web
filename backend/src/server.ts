import { Application } from 'express';
import { Express } from 'express';
import initApp from './app'

initApp().then(app: Application) => {
  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
});