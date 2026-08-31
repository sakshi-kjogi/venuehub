import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import {
  updateProfileSchema, type UpdateProfileFormValues,
  changePasswordSchema, type ChangePasswordFormValues,
} from '@/features/users/users.schemas';
import { useProfileQuery, useUpdateProfileMutation, useChangePasswordMutation } from '@/features/users/useUserQueries';

export default function Profile() {
  const { data: profile, isLoading } = useProfileQuery();
  const updateProfileMutation = useUpdateProfileMutation();
  const changePasswordMutation = useChangePasswordMutation();
  const navigate = useNavigate();

  const profileForm = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
  });

  useEffect(() => {
    if (profile) {
      profileForm.reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone ?? '',
        bio: profile.bio ?? '',
        city: profile.city ?? '',
        country: profile.country ?? '',
      });
    }
  }, [profile, profileForm]);

  const passwordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onProfileSubmit = (values: UpdateProfileFormValues) => updateProfileMutation.mutate(values);

  const onPasswordSubmit = (values: ChangePasswordFormValues) => {
    changePasswordMutation.mutate(values, {
      onSuccess: () => navigate('/login'),
    });
  };

  if (isLoading) {
    return <div className="mt-16 text-center text-gray-500">Loading…</div>;
  }

  return (
    <div className="mx-auto mt-16 max-w-lg space-y-12">
      <section>
        <h1 className="text-2xl font-semibold">Your profile</h1>
        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="mt-6 space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium">First name</label>
              <input {...profileForm.register('firstName')} className="mt-1 w-full rounded border px-3 py-2" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium">Last name</label>
              <input {...profileForm.register('lastName')} className="mt-1 w-full rounded border px-3 py-2" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input {...profileForm.register('phone')} className="mt-1 w-full rounded border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Bio</label>
            <textarea {...profileForm.register('bio')} rows={3} className="mt-1 w-full rounded border px-3 py-2" />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium">City</label>
              <input {...profileForm.register('city')} className="mt-1 w-full rounded border px-3 py-2" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium">Country</label>
              <input {...profileForm.register('country')} className="mt-1 w-full rounded border px-3 py-2" />
            </div>
          </div>
          {updateProfileMutation.isSuccess && (
            <p className="text-sm text-green-600">Profile updated.</p>
          )}
          <button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {updateProfileMutation.isPending ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Change password</h2>
        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium">Current password</label>
            <input {...passwordForm.register('currentPassword')} type="password" className="mt-1 w-full rounded border px-3 py-2" />
            {passwordForm.formState.errors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">{passwordForm.formState.errors.currentPassword.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">New password</label>
            <input {...passwordForm.register('newPassword')} type="password" className="mt-1 w-full rounded border px-3 py-2" />
            {passwordForm.formState.errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">{passwordForm.formState.errors.newPassword.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Confirm new password</label>
            <input {...passwordForm.register('confirmPassword')} type="password" className="mt-1 w-full rounded border px-3 py-2" />
            {passwordForm.formState.errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{passwordForm.formState.errors.confirmPassword.message}</p>
            )}
          </div>
          {changePasswordMutation.isError && (
            <p className="text-sm text-red-600">Current password is incorrect.</p>
          )}
          <button
            type="submit"
            disabled={changePasswordMutation.isPending}
            className="rounded bg-gray-800 px-4 py-2 text-white disabled:opacity-50"
          >
            {changePasswordMutation.isPending ? 'Updating…' : 'Change password'}
          </button>
          <p className="text-xs text-gray-500">
            Changing your password will log you out of all sessions.
          </p>
        </form>
      </section>
    </div>
  );
}