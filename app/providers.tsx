'use client';

import { SessionProvider } from 'next-auth/react';
import { ConfigProvider } from 'antd';

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#059669',
          },
        }}
      >
        {children}
      </ConfigProvider>
    </SessionProvider>
  );
}