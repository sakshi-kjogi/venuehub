import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { registerSchema, type RegisterFormValues } from '@/features/auth/auth.schemas';
import { useRegisterMutation } from '@/features/auth/useAuthMutations';

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'CUSTOMER' },
  });
  const registerMutation = useRegisterMutation();

  const onSubmit = (values: RegisterFormValues) => registerMutation.mutate(values);

  return (
    <div className="mx-auto mt-16 max-w-sm">
      <h1 className="text-2xl font-semibold">Create an account</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium">First name</label>
            <input {...register('firstName')} className="mt-1 w-full rounded border px-3 py-2" />
            {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium">Last name</label>
            <input {...register('lastName')} className="mt-1 w-full rounded border px-3 py-2" />
            {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
          </div>
        </div>
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
        <div>
          <label className="block text-sm font-medium">I want to</label>
          <select {...register('role')} className="mt-1 w-full rounded border px-3 py-2 bg-white">
            <option value="CUSTOMER">Book venues and vendors (Customer)</option>
            <option value="VENUE_OWNER">List and manage my venue (Venue Owner)</option>
            <option value="VENDOR">Offer services as a vendor (Vendor)</option>
          </select>
          {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
        </div>
        {registerMutation.isError && (
          <p className="text-sm text-red-600">Could not create account. Email may already be in use.</p>
        )}
        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {registerMutation.isPending ? 'Creating account…' : 'Register'}
        </button>
      </form>
      <p className="mt-4 text-sm">
        Already have an account? <Link to="/login" className="text-blue-600">Log in</Link>
      </p>
    </div>
  );
}