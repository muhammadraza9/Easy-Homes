'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Spin, Button, Tag } from 'antd';
import {
  ArrowLeftOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  BankOutlined,
  LockOutlined,
  LoginOutlined,
} from '@ant-design/icons';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { status } = useSession();

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') { setLoading(false); return; }

    const rawId = params?.id;
    const resolvedId = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!resolvedId) {
      setError('No property ID found in URL.');
      setLoading(false);
      return;
    }

    axios
      .get(`/api/properties/${resolvedId}`)
      .then((res) => setProperty(res.data))
      .catch((err) => {
        const msg =
          err?.response?.data?.error ||
          err?.response?.statusText ||
          err?.message ||
          'Unknown error';
        setError(`Status: ${err?.response?.status} — ${msg}`);
      })
      .finally(() => setLoading(false));
  }, [params, status]);

  // ── LOADING ──
  if (status === 'loading' || loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: 100 }}>
        <Spin size="large" style={{ color: '#059669' }} />
      </div>
    );
  }

  // ── NOT LOGGED IN ──
  if (status === 'unauthenticated') {
    return (
      <div
        style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f3f4f6',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            background: '#fff',
            borderRadius: 16,
            padding: '48px 40px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
            maxWidth: 420,
            width: '100%',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: '#f0fdf4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              border: '2px solid #bbf7d0',
            }}
          >
            <LockOutlined style={{ fontSize: 28, color: '#059669' }} />
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
            Login Required
          </h2>
          <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 28 }}>
            Please sign in to view property details and contact the seller.
          </p>

          <Button
            type="primary"
            size="large"
            icon={<LoginOutlined />}
            block
            onClick={() => router.push('/auth/signin')}
            style={{
              background: '#059669',
              borderColor: '#059669',
              fontWeight: 700,
              height: 48,
              borderRadius: 10,
              marginBottom: 12,
            }}
          >
            Sign In to Continue
          </Button>

          <Button
            size="large"
            block
            icon={<ArrowLeftOutlined />}
            onClick={() => router.back()}
            style={{ height: 48, borderRadius: 10, fontWeight: 600 }}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // ── ERROR ──
  if (error) {
    return (
      <div style={{ maxWidth: 600, margin: '80px auto', padding: 30 }}>
        <h2 style={{ color: '#dc2626' }}>Something went wrong</h2>
        <p
          style={{
            fontSize: 15,
            background: '#fef2f2',
            padding: 16,
            borderRadius: 8,
            color: '#991b1b',
          }}
        >
          {error}
        </p>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.back()}
          style={{ marginTop: 16 }}
        >
          Go Back
        </Button>
      </div>
    );
  }

  if (!property) return null;

  let images: string[] = [];
  try {
    images =
      typeof property.images === 'string'
        ? JSON.parse(property.images)
        : property.images || [];
  } catch {
    images = [];
  }

  return (
    <div style={{ background: '#f3f4f6', minHeight: '100vh' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '30px 20px' }}>

        {/* BACK BUTTON */}
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.back()}
          style={{
            marginBottom: 24,
            fontWeight: 600,
            borderColor: '#059669',
            color: '#059669',
          }}
        >
          Back
        </Button>

        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          }}
        >
          {/* IMAGE */}
          {images[0] && (
            <div style={{ position: 'relative' }}>
              <img
                src={images[0]}
                alt={property.title}
                style={{
                  width: '100%',
                  height: 420,
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              {/* TYPE BADGE */}
              {property.type && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 16,
                    left: 16,
                    background: '#059669',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 14px',
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 700,
                    boxShadow: '0 4px 14px rgba(5,150,105,0.4)',
                  }}
                >
                  {property.type === 'House' ? (
                    <HomeOutlined />
                  ) : (
                    <BankOutlined />
                  )}
                  {property.type}
                </div>
              )}
            </div>
          )}

          {/* CONTENT */}
          <div style={{ padding: '28px 32px 36px' }}>

            {/* TITLE + PRICE ROW */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: 12,
                marginBottom: 10,
              }}
            >
              <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>
                {property.title}
              </h1>
              <h2
                style={{
                  color: '#059669',
                  fontWeight: 800,
                  fontSize: 24,
                  margin: 0,
                  whiteSpace: 'nowrap',
                }}
              >
                PKR {Number(property.price).toLocaleString('en-PK')}
              </h2>
            </div>

            {/* LOCATION */}
            <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 20 }}>
              <EnvironmentOutlined
                style={{ color: '#059669', marginRight: 6 }}
              />
              {property.location}
            </p>

            <hr style={{ border: 'none', borderTop: '1px solid #f3f4f6', marginBottom: 20 }} />

            {/* DESCRIPTION */}
            <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 10 }}>
              About this Property
            </h3>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.9,
                color: '#374151',
              }}
            >
              {property.description ||
                'No description provided for this property.'}
            </p>

            {/* POSTED BY */}
            {property.user && (
              <>
                <hr style={{ border: 'none', borderTop: '1px solid #f3f4f6', margin: '24px 0' }} />
                <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>
                  Posted By
                </h3>
                <p style={{ color: '#4b5563', fontSize: 15 }}>
                  {property.user.name || property.user.email}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}