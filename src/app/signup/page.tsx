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
import Image from 'next/image';

const formSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: 'password123', // Default mock password
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const success = signup(values.username, values.email, values.password);
    if (success) {
      toast({ title: 'Account created!', description: "You've been logged in." });
      router.push('/profile');
    } else {
      toast({
        variant: 'destructive',
        title: 'Signup failed.',
        description: 'A user with that username or email may already exist.',
      });
    }
  }

  return (
    <div className="w-full lg:grid lg:min-h-[calc(100vh-10rem)] lg:grid-cols-2 xl:min-h-[calc(100vh-10rem)]">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 order-2 lg:order-1">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold font-headline">Create an Account</h1>
            <p className="text-balance text-muted-foreground">
              Enter your information to join our creative community.
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="your_username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <Button type="submit" className="w-full">
                Create an account
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline text-primary">
              Login
            </Link>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block order-1 lg:order-2">
        <Image
          src="https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1932&auto=format&fit=crop"
          alt="Creative artwork"
          width="1920"
          height="1080"
          className="h-full w-full object-cover"
          data-ai-hint="creative artwork"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-black/0" />
        <div className="absolute bottom-10 left-10 text-white p-4">
            <h2 className="text-4xl font-bold font-headline leading-tight">Join a World of <br/>Endless Creativity.</h2>
            <p className="mt-4 max-w-md text-gray-200">Share your passion, discover new artists, and become part of our vibrant community.</p>
        </div>
      </div>
    </div>
  );
}
