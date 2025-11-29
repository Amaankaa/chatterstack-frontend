import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { login, loginSchema, LoginInput, getUserByEmail } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast'; // Adjusted import path if needed
import AuthLayout from '@/components/layouts/AuthLayout';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      // 1. Login to get tokens
      const res = await login(data);
      
      // 2. Store tokens immediately so the next request works
      localStorage.setItem('access_token', res.access_token);
      localStorage.setItem('refresh_token', res.refresh_token);

      // 3. If 'user' is missing in response, fetch it using the email
      let userProfile = res.user;
      if (!userProfile) {
         userProfile = await getUserByEmail(data.email);
      }

      // 4. Update Store
      setAuth(userProfile!, res.access_token, res.refresh_token);
      
      const { dismiss } = toast({ title: "Welcome back!", description: "Logged in successfully." });
      setTimeout(() => dismiss(), 1000);

      navigate('/chat');
    } catch (error: any) {
      console.error(error);
      toast({ 
        variant: "destructive",
        title: "Login Failed", 
        description: "Check your credentials." 
      });
    }
  };

  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Enter your email to sign in to your account"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            placeholder="name@example.com" 
            type="email" 
            autoCapitalize="none" 
            autoComplete="email" 
            autoCorrect="off"
            disabled={isSubmitting}
            {...register('email')} 
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            type="password" 
            autoComplete="current-password"
            disabled={isSubmitting}
            {...register('password')} 
          />
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>
        <Button disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign In
        </Button>
      </form>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-slate-50 px-2 text-muted-foreground">Or</span>
        </div>
      </div>
      
      <p className="px-8 text-center text-sm text-muted-foreground">
        <Link to="/register" className="hover:text-brand underline underline-offset-4">
          Don't have an account? Sign Up
        </Link>
      </p>
    </AuthLayout>
  );
}