import knex from 'knex';
import { getNamespace } from 'continuation-local-storage';

import commonDb from './commonDb';

let connection;
let connectionMap;

export async function connectAllDb() {
  let apps;

  try {
    apps = await commonDb.select('*').from('apps');
  } catch (e) {
    console.log('error', e);

    return;
  }

  connectionMap =
    apps
      .map(app => {
        return {
          [app.name]: knex(createConnectionConfig(app))
        }
      })
      .reduce((prev, next) => {
        return Object.assign({}, prev, next);
      }, {});
}

export function getConnectionByDb(dbName) {
  if (connectionMap) {
    return connectionMap[dbName];
  }
}

export function setConnection(conn) {
  connection = conn;
}

export function getConnection() {
  // Easy peasy way!!

  // if (connection) {
  //   return connection;
  // }

  // Hmm could do this now using continuation-local-storage!!
  // let nameSpace = getNamespace('unique context');
  // const conn = nameSpace.get('connection');

  // if (conn) {
  //   return conn;
  // }

  // Perhaps zone.js seems to have lots of stars :D
  const conn = Zone.current.get('connection');

  if(conn) {
    return conn;
  }
}

function createConnectionConfig(rawConfig) {
  return {
    client: process.env.DB_CLIENT,
    connection: {
      port: rawConfig.db_port,
      user: rawConfig.db_username,
      database: rawConfig.db_name,
      password: rawConfig.db_password_hashed
    },
    pool: { min: 2, max: 20 }
  };
}
