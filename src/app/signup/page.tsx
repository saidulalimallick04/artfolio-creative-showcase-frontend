'use client';

import { useState, useEffect } from 'react';
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
  confirmPassword: z.string().min(6, { message: 'Confirm Password must be at least 6 characters.' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function SignupPage() {
  const router = useRouter();
  const { signup, user } = useAuth();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const preferredPage = localStorage.getItem('landingPage') || '/';
      router.push(preferredPage);
    }
  }, [user, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // Only send necessary fields to backend
      const success = await signup(values.username, values.email, values.password);

      // Simulate a bit of delay so the user can see the progress bar
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (success) {
        toast({
          title: 'Registration successful!',
          description: "Please log in to continue."
        });
        router.push('/login');
      } else {
        toast({
          variant: 'destructive',
          title: 'Signup failed.',
          description: 'A user with that username or email may already exist.',
        });
        setIsLoading(false);
      }
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Signup error.',
        description: 'Something went wrong.',
      });
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full h-screen flex overflow-hidden bg-background">
      {/* Left Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative overflow-y-auto">
        <div className="w-full max-w-[400px] space-y-8 animate-in fade-in slide-in-from-left-4 duration-500 my-auto">

          {/* Header */}
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight font-headline">Create an Account</h1>
            <p className="text-sm text-muted-foreground">
              Enter your information to join our creative community.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="your_username"
                        autoComplete="off"
                        {...field}
                        value={field.value ?? ''}
                        className="bg-muted/30 border-input/50 focus:bg-background h-11"
                        disabled={isLoading}
                      />
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
                      <Input
                        type="email"
                        placeholder="m@example.com"
                        autoComplete="username"
                        {...field}
                        value={field.value ?? ''}
                        className="bg-muted/30 border-input/50 focus:bg-background h-11"
                        disabled={isLoading}
                      />
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
                      <Input
                        type="password"
                        placeholder="******"
                        autoComplete="new-password"
                        {...field}
                        value={field.value ?? ''}
                        className="bg-muted/30 border-input/50 focus:bg-background h-11"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="******"
                        autoComplete="new-password"
                        {...field}
                        value={field.value ?? ''}
                        className="bg-muted/30 border-input/50 focus:bg-background h-11"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full h-11 font-medium text-base shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 relative overflow-hidden"
                disabled={isLoading}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? 'Creating account...' : 'Create an account'}
                </span>

                {/* Progress Bar */}
                {isLoading && (
                  <div className="absolute bottom-0 left-0 h-1 bg-white/50 animate-[progress_2s_ease-in-out_infinite] w-full origin-left" />
                )}
              </Button>
            </form>
          </Form>
          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-primary hover:underline underline-offset-4 transition-colors">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image Panel */}
      <div className="hidden lg:flex lg:w-1/2 p-6 flex-col justify-center items-center bg-transparent relative">
        {/* Container for the rounded image */}
        <div className="relative w-[40vw] h-[75vh] rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-border/10">
          <Image
            src="https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1932&auto=format&fit=crop"
            alt="Creative artwork"
            fill
            className="object-cover animate-ken-burns"
            data-ai-hint="creative artwork"
            sizes="(max-width: 1024px) 100vw, 80vw"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-12 text-white z-10">
            <div className="space-y-4 max-w-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                Featured Artist
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-headline leading-tight">Join a World of <br />Endless Creativity.</h2>
              <p className="text-white/80 text-lg">Share your passion, discover new artists, and become part of our vibrant community.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
