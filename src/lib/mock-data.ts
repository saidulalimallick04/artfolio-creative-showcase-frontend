import { PlaceHolderImages } from './placeholder-images';
import type { User, Artwork } from './types';

const users: User[] = [
  {
    id: 'user1',
    username: 'CreativeSoul',
    email: 'creative@example.com',
    password: 'password123',
    avatarUrl: 'https://picsum.photos/seed/avatar1/100/100',
  },
  {
    id: 'user2',
    username: 'ArtExplorer',
    email: 'explorer@example.com',
    password: 'password123',
    avatarUrl: 'https://picsum.photos/seed/avatar2/100/100',
  },
  {
    id: 'user3',
    username: 'PixelPainter',
    email: 'pixel@example.com',
    password: 'password123',
    avatarUrl: 'https://picsum.photos/seed/avatar3/100/100',
  },
];

const artworks: Artwork[] = PlaceHolderImages.map((img, index) => {
  const user = users[index % users.length];
  return {
    id: img.id,
    title: img.description.split(' ').slice(0, 3).join(' '),
    description: img.description,
    imageUrl: img.imageUrl,
    imageHint: img.imageHint,
    authorId: user.id,
    authorUsername: user.username,
  };
});

export function getArtworks(): Artwork[] {
  return artworks;
}

export function getArtworksByUsername(username: string): Artwork[] {
  return artworks.filter((artwork) => artwork.authorUsername === username);
}

export function getUsers(): User[] {
  return users;
}

export function getUserByUsername(username: string): User | undefined {
  return users.find((user) => user.username === username);
}

export function getUserByEmail(email: string): User | undefined {
  return users.find((user) => user.email === email);
}

export function addUser(user: User) {
  users.push(user);
}
