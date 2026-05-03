'use client';

import { SessionProvider } from 'next-auth/react';
import { ConfigProvider } from 'antd';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1890ff',
          },
        }}
      >
        {children}
      </ConfigProvider>
    </SessionProvider>
  );
}
