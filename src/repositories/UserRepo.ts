import { User } from '../models/User';

class UserRepo {
  constructor() {}

  findByEmail(email: string) {
    return User.findOne({ where: { email } });
  }

  findByUsername(username: string) {
    return User.findOne({ where: { username } });
  }

  findById(id: number) {
    return User.findByPk(id);
  }

  createUser(userData: {
    username: string;
    email: string;
    password: string;
    role?: string;
  }) {
    return User.create(userData);
  }
}

export default new UserRepo();
