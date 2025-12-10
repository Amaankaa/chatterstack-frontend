import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerUser } from '@/api/auth';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import AuthLayout from '@/components/layouts/AuthLayout';
import { Loader2 } from 'lucide-react';

// Local form schema (frontend-only) with confirmPassword
const registerFormSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((vals) => vals.password === vals.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterFormInput = z.infer<typeof registerFormSchema>;

export default function Register() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormInput>({
    resolver: zodResolver(registerFormSchema),
  });

  const onSubmit = async (data: RegisterFormInput) => {
    try {
      // Only send username/email/password to backend
      const payload = { username: data.username, email: data.email, password: data.password };
      await registerUser(payload);
      toast({ title: 'Account created', description: 'You can now sign in.' });
      navigate('/login');
    } catch (error: any) {
      toast({ 
        variant: "destructive",
        title: "Error", 
        description: error?.response?.data?.error || error?.message || "Registration failed" 
      });
    }
  };

  return (
    <AuthLayout 
      title="Create an account" 
      subtitle="Enter your details below to create your account"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" placeholder="johndoe" disabled={isSubmitting} {...register('username')} />
          {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="name@example.com" disabled={isSubmitting} {...register('email')} />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" disabled={isSubmitting} {...register('password')} />
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input id="confirmPassword" type="password" disabled={isSubmitting} {...register('confirmPassword')} />
          {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
        </div>
        <Button disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Account
        </Button>
      </form>
      
      <p className="px-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="underline underline-offset-4 hover:text-primary">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}