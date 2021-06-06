import bcrypt from 'bcrypt';

import { HASH_SALT } from '../constants';

export const getHash = (password: string) => bcrypt.hashSync(password, HASH_SALT);
