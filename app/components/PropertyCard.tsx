'use client';

import { useState } from 'react';
import { Card, Button } from 'antd';
import {
  HomeOutlined,
  BankOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';

export default function PropertyCard({ property }: any) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  // images fix
  let images: string[] = [];

  try {
    images =
      typeof property.images === 'string'
        ? JSON.parse(property.images)
        : property.images || [];
  } catch {
    images = [];
  }

  const image =
    images[0] ||
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994';

  return (
    <Card
      hoverable
      style={{
        borderRadius: 14,
        overflow: 'hidden',
        position: 'relative',
      }}
      cover={
        <div style={{ position: 'relative' }}>

          {/* IMAGE */}
          <img
            src={image}
            alt={property.title}
            style={{
              height: 240,
              width: '100%',
              objectFit: 'cover',
            }}
          />

          {/* 🔥 FLOATING ICON (TOP RIGHT HALF OUTSIDE) */}
          <div
            style={{
              position: 'absolute',
              top: -14,
              right: 12,
              zIndex: 20,
              background: '#059669',
              color: '#fff',
              width: 44,
              height: 44,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              border: '3px solid #fff',
            }}
          >
            {property.type === 'House' ? (
              <HomeOutlined style={{ fontSize: 20 }} />
            ) : (
              <BankOutlined style={{ fontSize: 20 }} />
            )}
          </div>

        </div>
      }
    >
      {/* TITLE */}
      <h2 style={{ fontSize: 18, fontWeight: 700 }}>
        {property.title}
      </h2>

      {/* LOCATION */}
      <p style={{ color: '#6b7280' }}>
        {property.location}
      </p>

      {/* DESCRIPTION (2–3 LINES) */}
      <p
        style={{
          fontSize: 13,
          color: '#4b5563',
          marginTop: 8,
          display: expanded ? 'block' : '-webkit-box',
          WebkitLineClamp: expanded ? 'unset' : 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {property.description}
      </p>

      {/* READ MORE */}
      <Button
        type="link"
        onClick={() => setExpanded(!expanded)}
        style={{ padding: 0, fontSize: 12 }}
      >
        {expanded ? 'Read Less' : 'Read More'}
      </Button>

      {/* PRICE */}
      <h3
        style={{
          color: '#059669',
          marginTop: 10,
          fontWeight: 800,
        }}
      >
        PKR {Number(property.price).toLocaleString()}
      </h3>

      {/* BUTTON */}
      <Button
        type="primary"
        block
        onClick={() =>
          router.push(`/property/${property.id}`)
        }
        style={{
          marginTop: 10,
          background: '#059669',
        }}
      >
        View Details
      </Button>
    </Card>
  );
}