/* eslint-disable @typescript-eslint/no-namespace */
import { User as UserModel } from '@prisma/client';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    export interface User extends UserModel {
      sub: string;
    }
  }

  namespace NodeJS {
    export interface ProcessEnv {
      DATABASE_URL: string;
      CLIENT_HOST: string;

      JWT_ACCESS_SECRET: string;
      JWT_ACCESS_EXPIRE: string;
      JWT_ACCESS_EXPIRE_DATE: string;

      JWT_REFRESH_SECRET: string;
      JWT_REFRESH_EXPIRE: string;
    }
  }
}
