import { PlaceHolderImages } from './placeholder-images';
import type { User, Artwork } from './types';

const users: User[] = [
  {
    id: 'user1',
    username: 'RongTuli',
    email: 'anika@example.com',
    password: 'password123',
    profile_image: 'https://picsum.photos/seed/Anika/100/100',
  },
  {
    id: 'user2',
    username: 'ShilpiMon',
    email: 'arjun@example.com',
    password: 'password123',
    profile_image: 'https://picsum.photos/seed/Arjun/100/100',
  },
  {
    id: 'user3',
    username: 'ChobiWala',
    email: 'priya@example.com',
    password: 'password123',
    profile_image: 'https://picsum.photos/seed/Priya/100/100',
  },
  {
    id: 'user4',
    username: 'SwapnoJal',
    email: 'rohan@example.com',
    password: 'password123',
    profile_image: 'https://picsum.photos/seed/Rohan/100/100',
  },
  {
    id: 'user5',
    username: 'DrishtiBodha',
    email: 'isha@example.com',
    password: 'password123',
    profile_image: 'https://picsum.photos/seed/Isha/100/100',
  },
  {
    id: 'user6',
    username: 'BornoPorichoy',
    email: 'vikram@example.com',
    password: 'password123',
    profile_image: 'https://picsum.photos/seed/Vikram/100/100',
  },
];

const artworks: Artwork[] = PlaceHolderImages.map((img) => {
  let user: User;
  const imgId = parseInt(img.id);

  if (imgId > 48) {
    user = users[5]; // BornoPorichoy
  } else if (imgId > 32) {
    user = users[4]; // DrishtiBodha
  } else if (imgId > 16) {
    user = users[3]; // SwapnoJal
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

export function getArtworkById(id: string): Artwork | undefined {
  return artworks.find((artwork) => artwork.id === id);
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
