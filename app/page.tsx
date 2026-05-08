'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

import { Row, Col, Card, Button, Tag, Skeleton } from 'antd';
import {
  EnvironmentOutlined,
  ArrowRightOutlined,
  SearchOutlined,
} from '@ant-design/icons';

export default function Home() {
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get('/api/properties?limit=15');

        if (Array.isArray(res.data)) {
          setFeaturedProperties(res.data);
        } else if (Array.isArray(res.data.data)) {
          setFeaturedProperties(res.data.data);
        } else {
          setFeaturedProperties([]);
        }
      } catch {
        setFeaturedProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div style={{ background: '#f3f4f6' }}>
      
      {/* HERO SECTION */}
      <section
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.55))',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            color: '#fff',
            padding: 20,
          }}
        >
          <h1 style={{ fontSize: 60, fontWeight: 900 }}>
            Find Your Dream Home
          </h1>

          <p style={{ fontSize: 18, maxWidth: 700, margin: '0 auto' }}>
            Browse verified properties across Pakistan with trusted listings.
          </p>

          <Link href="/properties">
            <Button
              type="primary"
              size="large"
              icon={<SearchOutlined />}
              style={{
                marginTop: 25,
                height: 52,
                borderRadius: 10,
                background: '#059669',
                borderColor: '#059669',
                fontWeight: 700,
              }}
            >
              Browse Properties
            </Button>
          </Link>
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <section style={{ padding: '80px 20px', background: '#f3f4f6' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>

          {/* HEADER + VIEW ALL */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
              flexWrap: 'wrap',
              gap: 10,
            }}
          >
            <h2
              style={{
                fontSize: 38,
                fontWeight: 900,
                color: '#16a34a',
                marginBottom: 10,
              }}
            >
              Featured Properties
            </h2>

            {/* 🔥 VIEW ALL BUTTON ADDED */}
            <Link href="/properties">
              <Button
                type="primary"
                icon={<ArrowRightOutlined />}
                style={{
                  background: '#16a34a',
                  borderColor: '#16a34a',
                  fontWeight: 700,
                }}
              >
                View All Properties
              </Button>
            </Link>
          </div>

          <p style={{ color: '#6b7280', marginBottom: 30 }}>
            Explore the latest verified listings
          </p>

          <Row gutter={[24, 24]}>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <Col key={i} xs={24} sm={12} lg={6}>
                    <Card style={{ background: '#f3f4f6', border: 'none' }}>
                      <Skeleton active />
                    </Card>
                  </Col>
                ))
              : featuredProperties.map((property) => {
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
                    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800';

                  return (
                    <Col key={property.id} xs={24} sm={12} lg={6}>
                      <Link href={`/property/${property.id}`}>
                        <Card
                          hoverable
                          style={{
                            background: '#f3f4f6',
                            border: '1px solid #e5e7eb',
                            borderRadius: 14,
                            position: 'relative',
                          }}
                          styles={{ body: { padding: 0 } }}
                        >

                          <div style={{ position: 'relative', height: 220 }}>
                            <Image
                              src={image}
                              alt={property.title}
                              fill
                              style={{ objectFit: 'cover' }}
                              unoptimized
                            />

                            {property.type && (
                              <Tag
                                style={{
                                  position: 'absolute',
                                  right: -8,
                                  top: 18,
                                  background: '#16a34a',
                                  color: '#fff',
                                  border: 'none',
                                  fontWeight: 700,
                                  borderRadius: 20,
                                  padding: '4px 10px',
                                }}
                              >
                                {property.type}
                              </Tag>
                            )}
                          </div>

                          <div style={{ padding: 16 }}>
                            <h3 style={{ fontSize: 18, fontWeight: 700 }}>
                              {property.title}
                            </h3>

                            <p style={{ color: '#6b7280' }}>
                              <EnvironmentOutlined style={{ color: '#16a34a' }} />{' '}
                              {property.location}
                            </p>

                            <p
                              style={{
                                fontSize: 13,
                                color: '#6b7280',
                                lineHeight: 1.6,
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                            >
                              {property.description ||
                                'Beautiful modern property with premium facilities and secure environment.'}
                            </p>

                            <p
                              style={{
                                fontSize: 20,
                                fontWeight: 800,
                                color: '#38bdf8',
                              }}
                            >
                              PKR {Number(property.price).toLocaleString('en-PK')}
                            </p>

                            <Button
                              type="link"
                              icon={<ArrowRightOutlined />}
                              style={{
                                color: '#16a34a',
                                fontWeight: 700,
                                padding: 0,
                              }}
                            >
                              View Details
                            </Button>
                          </div>

                        </Card>
                      </Link>
                    </Col>
                  );
                })}
          </Row>
        </div>
      </section>
    </div>
  );
}