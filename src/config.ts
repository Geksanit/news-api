import dotenv from 'dotenv';

type Config = {
  DB_NAME: string;
  DB_PASS: string;
  HOST: string;
  PORT: number;
  HASH_SALT: string;
  JWT_SECRET_KEY: string;
};

dotenv.config();

export const getConfig = (): Config => {
  const { DB_NAME, DB_PASS, HOST, PORT, HASH_SALT, JWT_SECRET_KEY } = process.env;
  if (!DB_NAME) {
    throw new Error('no DB_NAME');
  }
  if (!DB_PASS) {
    throw new Error('no DB_PASS');
  }
  if (!HASH_SALT) {
    throw new Error('no DB_NAME');
  }
  if (!JWT_SECRET_KEY) {
    throw new Error('no DB_PASS');
  }

  return {
    DB_NAME,
    DB_PASS,
    HOST: HOST || '127.0.0.1',
    PORT: PORT ? parseInt(PORT, 10) : 3000,
    HASH_SALT,
    JWT_SECRET_KEY,
  };
};
