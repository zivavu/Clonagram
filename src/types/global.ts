export type User = {
   id: string;
   username: string;
   avatar_url: string | null;
   full_name: string | null;
   bio: string | null;
   website: string | null;
   updated_at: string | null;
   created_at: string | null;
};

export type PartialUser = Pick<User, 'id' | 'username' | 'avatar_url'> &
   Partial<Pick<User, 'full_name'>>;

export type Media = {
   id: string;
   type: 'image' | 'video' | 'photo';
   url: string;
};
