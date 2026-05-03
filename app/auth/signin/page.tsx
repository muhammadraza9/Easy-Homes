'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    const result = await signIn('google', {
      redirect: false,
      callbackUrl: '/dashboard',
    });
    if (result?.ok) {
      router.push('/dashboard');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#1677ff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1677ff', marginBottom: '8px' }}>Easy Homes</h1>
            <p style={{ color: '#666' }}>Find your perfect property today</p>
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center', marginBottom: '24px' }}>Sign In to Your Account</h2>

          <button
            onClick={handleGoogleSignIn}
            style={{ width: '100%', padding: '12px', background: '#1677ff', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer', marginBottom: '16px' }}
          >
            Sign in with Google
          </button>

          <p style={{ textAlign: 'center', color: '#666', marginBottom: '16px' }}>First time here? Sign in to get started</p>

          <div style={{ background: '#f0f5ff', border: '1px solid #adc6ff', borderRadius: '6px', padding: '16px', fontSize: '14px', color: '#666' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>Why sign in?</p>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Post your properties</li>
              <li>Save favorite properties</li>
              <li>Connect with buyers/sellers</li>
              <li>Manage your account</li>
            </ul>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px', color: 'white' }}>
          <p>Back to <a href="/" style={{ color: 'white', textDecoration: 'underline' }}>home</a></p>
        </div>
      </div>
    </div>
  );
}