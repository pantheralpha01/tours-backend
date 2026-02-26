import { config } from 'dotenv';
config();

export default {
  db: {
    provider: 'postgresql',
    url: process.env.DATABASE_URL,
  },
};
