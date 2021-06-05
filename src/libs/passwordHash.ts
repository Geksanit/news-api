import bcrypt from 'bcrypt';

import { HASH_SALT } from '../constants';

export const getHash = async (password: string) => bcrypt.hash(password, HASH_SALT);
