'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from 'antd';
import { LogoutOutlined, LoginOutlined, HomeOutlined } from '@ant-design/icons';

export default function Header() {
  const { data: session, status } = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  return (
    <header className="bg-emerald-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:text-emerald-100 transition flex items-center gap-2">
          <HomeOutlined className="text-xl" />
          Easy Homes
        </Link>

        <nav className="flex gap-4 items-center">
          <Link href="/properties" className="hover:text-emerald-100 transition">
            Browse Properties
          </Link>
          {status === 'authenticated' && (
            <>
              <Link href="/properties/add" className="hover:text-emerald-100 transition">
                Post Property
              </Link>
              <Link href="/dashboard" className="hover:text-emerald-100 transition">
                Dashboard
              </Link>
              <span className="text-sm">{session?.user?.name}</span>
              <Button
                type="primary"
                danger
                size="small"
                icon={<LogoutOutlined />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          )}
          {status === 'unauthenticated' && (
            <Link href="/auth/signin">
              <Button type="primary" icon={<LoginOutlined />}>
                Sign In
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
