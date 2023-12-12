import { Express } from 'express';
import initApp from './app'

initApp().then((app: unknown) => {
  const port = process.env.PORT;
  (app as Express).listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
});