export type Artwork = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  authorId: string;
  authorUsername: string;
};

export type User = {
  id: string;
  username: string;
  email: string;
  password?: string;
  profile_image?: string;
  full_name?: string;
  bio?: string;
};
