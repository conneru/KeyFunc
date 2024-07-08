export interface Chat {
  id?: number | null;
  name?: string | null;
  image?: string | null;
  type?: number | null;
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
  tags?: Tag[] | null;
}

export interface Message {
  id?: number | null;
  userId?: number | null;
  postId?: number | null;
  chatId?: number | null;
  content?: string | null;
  createdAt?: string;
  edited?: boolean | null;
  chat?: Chat | null;
  user?: User | null;
  post?: Post | null;
  usersWhoHaveRead: number[];
}

interface FollowDictionary {
  [key: number]: User;
}

export interface User {
  id: number;
  username?: string | null;
  email?: string | null;
  joinedOn?: Date | null;
  profilePic?: string | null;
  following: FollowDictionary;
  followers: FollowDictionary;
  posts?: Post[];
  chats?: Chat[] | null;
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
  images: Image[];
  user?: User | null;
  createdAt: string;
  likes?: number | null;
}

export interface TimeDifference {
  formattedString: string;
  diffCode: string;
}
export type Tag = {
  id: string;
  imageId: number;
  username: string;
  top: string;
  left: string;
};

export interface CreatePost {
  UserId?: number;
  Description?: string;
  ContentTypes?: string[];
  FileList: File[];
  Tags?: Tag[][];
}

export interface Connect {
  events: Function;
  newMessage: Function;
}
