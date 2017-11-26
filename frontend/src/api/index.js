import client from './remote';

export const getUserList = async () => {
  return await client.get('/contacts/search.json');
}