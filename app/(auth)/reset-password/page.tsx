import { Suspense } from 'react';
import ResetPasswordForm from '@/components/form/ResetPasswordForm';

function ResetPasswordContent({ searchParams }: { searchParams: { token?: string } }) {
  const token = searchParams.token;

  if (!token) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="text-red-600">Invalid or missing reset token.</div>
      </div>
    );
  }

  return <ResetPasswordForm token={token} />;
}

export default function ResetPasswordPage({ searchParams }: { searchParams: { token?: string } }) {
  return (
    <div className=" flex flex-col justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}