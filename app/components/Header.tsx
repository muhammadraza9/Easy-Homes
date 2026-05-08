'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button, Space, Typography } from 'antd';
import {
  LogoutOutlined,
  LoginOutlined,
  HomeOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

export default function Header() {
  const { data: session, status } = useSession();

  const handleLogout = async () => {
    await signOut({
      redirect: true,
      callbackUrl: '/',
    });
  };

  return (
    <header
      style={{
        background: '#059669',
        color: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >

        {/* LOGO */}
     <Link
  href="/"
  style={{
    color: '#fff',
    fontSize: 22,
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    textDecoration: 'none',
  }}
>
  <HomeOutlined style={{ fontSize: 22, marginTop: 2 }} />
  <span style={{ lineHeight: 1, position: 'relative', top: 1 }}>
    Easy Homes
  </span>
</Link>

        {/* NAV */}
        <Space size="middle">

          <Link href="/properties" style={{ color: '#fff' }}>
            Browse Properties
          </Link>

          {status === 'authenticated' && (
            <>
              <Link href="/properties/add" style={{ color: '#fff' }}>
                Post Property
              </Link>

              <Link href="/dashboard" style={{ color: '#fff' }}>
                Dashboard
              </Link>

              <Text style={{ color: '#fff' }}>
                {session?.user?.name}
              </Text>

              <Button
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
              <Button icon={<LoginOutlined />}>
                Sign In
              </Button>
            </Link>
          )}

        </Space>

      </div>
    </header>
  );
}