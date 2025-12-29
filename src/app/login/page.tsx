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
import { LayoutGrid, Loader2 } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();
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
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await handleLogin(values.email, values.password);
  }

  async function handleLogin(email: string, password?: string) {
    setIsLoading(true);
    try {
      const success = await login(email, password || 'password123');
      if (success) {
        toast({ title: 'Login successful!', description: 'Welcome back.' });
        // Redirect based on user preference or default to Home (Global Feed)
        const preferredPage = localStorage.getItem('landingPage') || '/';
        router.push(preferredPage);
        // Don't set loading to false if redirecting, to prevent flash of content
      } else {
        toast({
          variant: 'destructive',
          title: 'Login failed.',
          description: 'Invalid email or password.',
        });
        setIsLoading(false);
      }
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Login error.',
        description: 'Something went wrong.',
      });
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full h-screen flex overflow-hidden bg-background">
      {/* Left Side - Image Panel */}
      <div className="hidden lg:flex lg:w-1/2 p-6 flex-col justify-center items-center bg-transparent relative">
        {/* Container for the rounded image */}
        <div className="relative w-[40vw] h-[75vh] rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-border/10">
          <Image
            src="https://images.unsplash.com/flagged/photo-1572392640988-ba48d1a74457?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Creative artwork"
            fill
            className="object-cover animate-ken-burns"
            priority
            sizes="(max-width: 1024px) 100vw, 80vw"
            unoptimized
          />

          {/* Overlay Content */}
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
              <h2 className="text-3xl md:text-4xl font-bold font-headline leading-tight">
                "Every artist was first an amateur."
              </h2>
              <p className="text-white/80 text-lg">
                Join our community of creators and start your journey today.
              </p>
            </div>
          </div>
        </div>
        {/* Decorative elements behind/around if needed, but keeping it clean for now */}
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative">
        <div className="w-full max-w-[400px] space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">

          {/* Logo / Header */}
          <div className="flex flex-col space-y-2 text-center">
            <Link href="/" className="mx-auto flex items-center gap-2 mb-2 transition-transform hover:scale-105">
              <div className="p-2 bg-primary/10 rounded-xl">
                <LayoutGrid className="h-6 w-6 text-primary" />
              </div>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight font-headline">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email to sign in to your account
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="name@example.com"
                        {...field}
                        className="bg-muted/30 border-input/50 focus:bg-background h-11"
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
                        placeholder="••••••••"
                        {...field}
                        className="bg-muted/30 border-input/50 focus:bg-background h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full h-11 font-medium text-base shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>

          {/* Footer */}
          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="font-semibold text-primary hover:underline underline-offset-4 transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
