interface User {
  user_id: string;
  name: string;
  email: string;
}

interface UserByEmail extends User {
  password: string;
  role: string;
}

interface UpdateUser {
  name?: string;
  password?: string;
}

export { User, UserByEmail, UpdateUser };
