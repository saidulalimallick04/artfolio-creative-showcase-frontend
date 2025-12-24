'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getUsers } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { User } from '@/lib/types';
import Image from 'next/image';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();
  const mockUsers = getUsers();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    handleLogin(values.email, values.password);
  }

  function handleLogin(email: string, password?: string) {
    const success = login(email, password || 'password123');
    if (success) {
      toast({ title: 'Login successful!', description: 'Welcome back.' });
      router.push('/profile');
    } else {
      toast({
        variant: 'destructive',
        title: 'Login failed.',
        description: 'Invalid email or password.',
      });
    }
  }

  return (
    <div className="w-full lg:grid lg:min-h-[calc(100vh-10rem)] lg:grid-cols-2 xl:min-h-[calc(100vh-10rem)]">
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="https://images.unsplash.com/photo-1549492423-400259a5e5a4?q=80&w=1974&auto=format&fit=crop"
          alt="Creative artwork"
          width="1920"
          height="1080"
          className="h-full w-full object-cover"
          data-ai-hint="creative artwork"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white">
          <div className="w-full max-w-md rounded-xl bg-white/10 p-6 backdrop-blur-sm border border-white/20">
            <h2 className="text-2xl font-bold mb-4 font-headline">Log in as an artist</h2>
            <p className="mb-6 text-gray-200">Select a mock artist to explore the application.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mockUsers.map((user: User) => (
                <button
                  key={user.id}
                  className="w-full text-left p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-300 flex items-center"
                  onClick={() => handleLogin(user.email, user.password)}
                >
                  <Avatar className="h-10 w-10 mr-3 border-2 border-white/50">
                    <AvatarImage src={user.avatarUrl} alt={user.username} />
                    <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-white">{user.username}</p>
                    <p className="text-xs text-gray-300">{user.email}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold font-headline">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline text-primary">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
