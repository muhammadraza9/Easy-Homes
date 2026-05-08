'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { Spin, Button } from 'antd';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    axios
      .get(`/api/properties/${id}`)
      .then((res) => setProperty(res.data))
      .catch(() => router.push('/properties'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: 100 }}>
        <Spin size="large" />
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
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 30 }}>
      <Button onClick={() => router.back()}>
        Back
      </Button>

      {images[0] && (
        <img
          src={images[0]}
          style={{
            width: '100%',
            height: 400,
            objectFit: 'cover',
            borderRadius: 12,
            marginTop: 20,
          }}
        />
      )}

      <h1 style={{ fontSize: 30, fontWeight: 800 }}>
        {property.title}
      </h1>

      <p style={{ color: '#666' }}>{property.location}</p>

      {/* FULL DESCRIPTION */}
      <p
        style={{
          marginTop: 20,
          fontSize: 15,
          lineHeight: 1.8,
          color: '#374151',
        }}
      >
        {property.description}
      </p>

      <h2 style={{ color: '#059669' }}>
        PKR {Number(property.price).toLocaleString()}
      </h2>
    </div>
  );
}