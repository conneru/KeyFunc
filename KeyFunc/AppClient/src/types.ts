export interface Chat {
  id?: number | null;
  name?: string | null;
  messages?: Message[] | null;
  users?: User[] | null;
}

export interface Image {
  id?: number | null;
  postId?: number | null;
  orderNum?: number | null;
  url?: string;
  user?: User | null;
  post?: Post | null;
}

export interface Message {
  id?: number | null;
  userId?: number | null;
  postId?: number | null;
  chatId?: number | null;
  content?: string | null;
  createAt?: Date | null;
  edited?: boolean | null;
  chat?: Chat | null;
  user?: User | null;
  post?: Post | null;
}

export interface User {
  id?: number | null;
  username?: string | null;
  email?: string | null;
  joinedOn?: Date | null;
  profilePic?: string | null;
  following?: User[] | null;
  followers?: User[] | null;
}

export interface NewUser {
  username?: string;
  email: string;
  password: string;
  confirmPass?: string;
}

export interface Post {
  id?: number | null;
  userId?: number | null;
  description?: string | null;
  comments?: Message[] | null;
  images?: Image[] | null;
  user?: User | null;
}
