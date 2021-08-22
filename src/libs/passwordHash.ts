import bcrypt from 'bcrypt';

import { getConfig } from '../config';

const config = getConfig();
export const getHash = (password: string) => bcrypt.hashSync(password, config.HASH_SALT);
