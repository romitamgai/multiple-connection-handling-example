import * as dbStuffs from '../dbStuffs';

export function getAllTodos() {
  return dbStuffs.getConnection().select('*').from('todos');  
}
