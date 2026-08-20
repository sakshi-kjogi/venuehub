import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { loginSchema, type LoginFormValues } from '@/features/auth/auth.schemas';
import { useLoginMutation } from '@/features/auth/useAuthMutations';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });
  const loginMutation = useLoginMutation();

  const onSubmit = (values: LoginFormValues) => loginMutation.mutate(values);

  return (
    <div className="mx-auto mt-16 max-w-sm">
      <h1 className="text-2xl font-semibold">Log in</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input {...register('email')} type="email" className="mt-1 w-full rounded border px-3 py-2" />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input {...register('password')} type="password" className="mt-1 w-full rounded border px-3 py-2" />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        </div>
        {loginMutation.isError && (
          <p className="text-sm text-red-600">Invalid email or password.</p>
        )}
        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {loginMutation.isPending ? 'Logging in…' : 'Log in'}
        </button>
      </form>
      <p className="mt-4 text-sm">
        No account? <Link to="/register" className="text-blue-600">Register</Link>
      </p>
    </div>
  );
}