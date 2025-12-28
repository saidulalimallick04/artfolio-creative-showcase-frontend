export interface User {
  id: string;
  username: string;
  email: string; // Only visible to self
  full_name?: string;
  bio?: string;
  is_active: boolean;
  is_artist: boolean;
  profile_image?: string;
}

export interface UserPublic {
  id: string;
  username: string;
  full_name?: string;
  bio?: string;
  is_artist: boolean;
  profile_image?: string;
}

export interface Artwork {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  owner: UserPublic;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  username: string;
}

export interface AccountUpdate {
  full_name?: string;
  bio?: string;
  image?: File;
}

export interface ArtworkCreate {
  title: string;
  description?: string;
  image: File;
}
