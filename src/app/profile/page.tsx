'use client';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileRedirectPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace(`/profile/${user.username}`);
    } else {
      router.replace('/login');
    }
  }, [user, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Loading profile...</p>
    </div>
  );
}
