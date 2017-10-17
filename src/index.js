import './env';
import express from 'express';
import 'zone.js/dist/zone-node.js';
import bodyParser from 'body-parser';

import * as dbStuffs from './dbStuffs';
import * as dbware from './middlewares/dbware';
import * as todoService from './services/todos';

const PORT = process.env.PORT;

let app = express();

app.set('port', PORT);
app.use(bodyParser.json());

dbStuffs.connectAllDb();

//API Routes
app.get('/', dbware.resolveConnection, async (req, res, next) => {
  let response;

  if (req.query.db === 'db1') {
    setTimeout(async () => {
      try {
        response = await todoService.getAllTodos();

      } catch (e) {
        console.log('error', e);
      }

      res.json({ body: response[0].name });
    }, 1000);
  } else {
    try {
      response = await todoService.getAllTodos();

    } catch (e) {
      console.log('error', e);
    }

    res.json({ body: response[0].name });
  }
});

app.listen(app.get('port'), () => {
  console.log(`Server started at port: ${PORT}`);
});
