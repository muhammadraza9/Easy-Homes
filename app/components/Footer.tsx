'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: '#111827',
        color: '#fff',
        marginTop: 50,
        padding: '40px 20px',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 30,
        }}
      >

        {/* ABOUT */}
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>
            🏠 Easy Homes
          </h3>
          <p style={{ color: '#9ca3af', lineHeight: 1.6 }}>
            Your trusted platform for buying, selling, and renting properties.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h4 style={{ fontWeight: 700, marginBottom: 10 }}>
            Quick Links
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link href="/properties" style={{ color: '#9ca3af' }}>
              Browse Properties
            </Link>
            <Link href="/about" style={{ color: '#9ca3af' }}>
              About Us
            </Link>
            <Link href="/contact" style={{ color: '#9ca3af' }}>
              Contact
            </Link>
          </div>
        </div>

        {/* USERS */}
        <div>
          <h4 style={{ fontWeight: 700, marginBottom: 10 }}>
            For Users
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link href="/auth/signin" style={{ color: '#9ca3af' }}>
              Sign In
            </Link>
            <Link href="/properties/add" style={{ color: '#9ca3af' }}>
              Post Property
            </Link>
            <Link href="/dashboard" style={{ color: '#9ca3af' }}>
              Dashboard
            </Link>
          </div>
        </div>

        {/* LEGAL */}
        <div>
          <h4 style={{ fontWeight: 700, marginBottom: 10 }}>
            Legal
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link href="/privacy" style={{ color: '#9ca3af' }}>
              Privacy Policy
            </Link>
            <Link href="/terms" style={{ color: '#9ca3af' }}>
              Terms of Service
            </Link>
          </div>
        </div>

      </div>

      {/* BOTTOM */}
      <div
        style={{
          borderTop: '1px solid #374151',
          marginTop: 30,
          paddingTop: 20,
          textAlign: 'center',
          color: '#9ca3af',
        }}
      >
        © {currentYear} Easy Homes. All rights reserved.
      </div>
    </footer>
  );
}