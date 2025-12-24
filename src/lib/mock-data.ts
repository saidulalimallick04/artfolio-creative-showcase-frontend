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
  {
    id: 'user4',
    username: 'DreamScaper',
    email: 'dream@example.com',
    password: 'password123',
    avatarUrl: 'https://picsum.photos/seed/avatar4/100/100',
  },
  {
    id: 'user5',
    username: 'VisionaryVibes',
    email: 'visionary@example.com',
    password: 'password123',
    avatarUrl: 'https://picsum.photos/seed/avatar5/100/100',
  },
  {
    id: 'user6',
    username: 'ChromaCanvas',
    email: 'chroma@example.com',
    password: 'password123',
    avatarUrl: 'https://picsum.photos/seed/avatar6/100/100',
  },
];

const artworks: Artwork[] = PlaceHolderImages.map((img) => {
  let user: User;
  const imgId = parseInt(img.id);

  if (imgId > 48) {
    user = users[5]; // ChromaCanvas
  } else if (imgId > 32) {
    user = users[4]; // VisionaryVibes
  } else if (imgId > 16) {
    user = users[3]; // DreamScaper
  } else {
    // Distribute first 16 images among first 3 users
    user = users[(imgId - 1) % 3];
  }

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
