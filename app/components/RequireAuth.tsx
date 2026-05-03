'use client';

import { useSession } from 'next-auth/react';
import { Result, Button, Spin } from 'antd';
import Link from 'next/link';

interface RequireAuthProps {
  children: React.ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Result
          status="403"
          title="Authentication Required"
          subTitle="You need to be logged in to access this page."
          extra={
            <Link href="/auth/signin">
              <Button type="primary" size="large">
                Sign In
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return <>{children}</>;
}
