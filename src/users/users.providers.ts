import { User } from './entities/user.entity';
import { USER_REPOSITORY } from './index';

export const usersProviders = [
  {
    provide: USER_REPOSITORY,
    useValue: User,
  },
];
