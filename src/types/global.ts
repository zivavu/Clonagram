export type User = {
   id: string;
   username: string;
   avatarUrl: string;
   email: string;
   name: string;
   bio: string;
   website: string;
   location: string;
   followers: number;
   following: number;
   posts: number;
   createdAt: string;
   updatedAt: string;
};

export type PartialUser = Pick<User, 'id' | 'username' | 'avatarUrl'>;

export type Media = {
   id: string;
   type: 'image' | 'video';
   url: string;
};
