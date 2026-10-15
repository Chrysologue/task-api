type Role = "user" | "admin"

interface User {
  user_id: string;
  name: string;
  email: string;
}

interface UserByEmail extends User {
  password: string;
  role: Role;
}

interface UpdateUser {
  name?: string;
  password?: string;
}

interface JwtPayload {
  id: string;
  role: Role
}

interface CreateUser {
  name: string;
  email: string;
  password: string;
}
export { User, UserByEmail, UpdateUser, JwtPayload, Role, CreateUser };
