import { createNamespace } from 'continuation-local-storage';

import { getConnectionByDb, setConnection } from '../dbStuffs';

let nameSpace = createNamespace('unique context');

export function resolveConnection(req, res, next) {
  const dbName = req.query.db;

  if (!dbName) {
    res.json({ message: 'please provide db name to connect' });
    return;
  }

  // Wrong way
  // setConnection(getConnectionByDb(dbName));
  // next();

  // Well why not use continuation-local-storage
  // TODO: Use additional logic to check the dbName

  // nameSpace.run(() => {
  //   nameSpace.set('connection', getConnectionByDb(dbName))
  //   next();
  // })

  // Could it be better by using zone.js? Why not :)
  Zone.current.fork({
    name: 'api',
    properties: {
      connection: getConnectionByDb(dbName)
    }
  }).run(() => {
    next();
  });

  // TODO: 
  // Could be even better if we could move the setting connection code elsewhere
  // So that the middleware does not need to know the implementation

}