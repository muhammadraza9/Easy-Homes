'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

import { Row, Col, Button, Skeleton } from 'antd';
import {
  EnvironmentOutlined,
  ArrowRightOutlined,
  SearchOutlined,
  HomeOutlined,
  BankOutlined,
  HeartFilled,
  HeartOutlined,
} from '@ant-design/icons';

export default function Home() {
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());

  const toggleSave = (e: React.MouseEvent, id: number) => {
    e.preventDefault(); // Link navigate na kare
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

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

      {/* ── HERO SECTION ── */}
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
            background: 'linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.55))',
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

      {/* ── FEATURED PROPERTIES ── */}
      <section style={{ padding: '80px 20px', background: '#f3f4f6' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>

          {/* Header + View All */}
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

          <p style={{ color: '#6b7280', marginBottom: 40 }}>
            Explore the latest verified listings
          </p>

          <Row gutter={[24, 40]}>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <Col key={i} xs={24} sm={12} lg={6}>
                    <div
                      style={{
                        background: '#fff',
                        borderRadius: 14,
                        padding: 16,
                        border: '1px solid #e5e7eb',
                      }}
                    >
                      <Skeleton active />
                    </div>
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

                  const isSaved = savedIds.has(property.id);

                  return (
                    <Col key={property.id} xs={24} sm={12} lg={6}>
                      <Link href={`/property/${property.id}`}>

                        {/* ✅ Outer wrapper — overflow visible taake badge bahar aa sake */}
                        <div
                          style={{
                            position: 'relative',
                            borderRadius: 14,
                            background: '#fff',
                            border: '1px solid #e5e7eb',
                            boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                            overflow: 'visible',
                            cursor: 'pointer',
                            transition: 'box-shadow 0.2s ease',
                          }}
                          onMouseEnter={e =>
                            (e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.13)')
                          }
                          onMouseLeave={e =>
                            (e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)')
                          }
                        >

                          {/* ── IMAGE — overflow hidden sirf yahan ── */}
                          <div
                            style={{
                              position: 'relative',
                              height: 220,
                              borderRadius: '14px 14px 0 0',
                              overflow: 'hidden',
                            }}
                          >
                            <Image
                              src={image}
                              alt={property.title}
                              fill
                              style={{ objectFit: 'cover' }}
                              unoptimized
                            />
                          </div>

                          {/* 🔥 BADGE — bilkul PropertyCard jesa, top right adha bahar */}
                          {property.type && (
                            <div
                              style={{
                                position: 'absolute',
                                top: -16,
                                right: 14,
                                background: '#059669',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 5,
                                padding: '5px 12px',
                                borderRadius: 20,
                                fontSize: 12,
                                fontWeight: 700,
                                boxShadow: '0 4px 14px rgba(5,150,105,0.45)',
                                border: '2.5px solid #fff',
                                zIndex: 10,
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {property.type === 'House' ? (
                                <HomeOutlined style={{ fontSize: 13 }} />
                              ) : (
                                <BankOutlined style={{ fontSize: 13 }} />
                              )}
                              {property.type}
                            </div>
                          )}

                          {/* ── CARD BODY ── */}
                          <div style={{ padding: '20px 16px 16px' }}>

                            <h3
                              style={{
                                fontSize: 16,
                                fontWeight: 700,
                                marginBottom: 4,
                              }}
                            >
                              {property.title}
                            </h3>

                            <p style={{ color: '#6b7280', marginBottom: 6 }}>
                              <EnvironmentOutlined
                                style={{ color: '#059669', marginRight: 4 }}
                              />
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
                                marginBottom: 8,
                              }}
                            >
                              {property.description ||
                                'Beautiful modern property with premium facilities and secure environment.'}
                            </p>

                            <p
                              style={{
                                fontSize: 18,
                                fontWeight: 800,
                                color: '#059669',
                                margin: '8px 0 12px',
                              }}
                            >
                              PKR{' '}
                              {Number(property.price).toLocaleString('en-PK')}
                            </p>

                            {/* ── VIEW DETAILS + HEART ── */}
                            <div
                              style={{
                                display: 'flex',
                                gap: 10,
                                alignItems: 'center',
                              }}
                            >
                              {/* VIEW DETAILS */}
                              <Button
                                type="primary"
                                block
                                icon={<ArrowRightOutlined />}
                                style={{
                                  background: '#059669',
                                  border: 'none',
                                  fontWeight: 600,
                                }}
                              >
                                View Details
                              </Button>

                              {/* ❤️ HEART BUTTON — saved tu "Saved", unsaved tu "Save" */}
                              <button
                                onClick={(e) => toggleSave(e, property.id)}
                                title={isSaved ? 'Unsave' : 'Save'}
                                style={{
                                  flexShrink: 0,
                                  width: 40,
                                  height: 40,
                                  borderRadius: '50%',
                                  border: `2px solid ${isSaved ? '#ef4444' : '#d1d5db'}`,
                                  background: isSaved ? '#fef2f2' : '#fff',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'all 0.25s ease',
                                  boxShadow: isSaved
                                    ? '0 0 0 3px rgba(239,68,68,0.15)'
                                    : 'none',
                                }}
                              >
                                {isSaved ? (
                                  <HeartFilled
                                    style={{ fontSize: 18, color: '#ef4444' }}
                                  />
                                ) : (
                                  <HeartOutlined
                                    style={{ fontSize: 18, color: '#9ca3af' }}
                                  />
                                )}
                              </button>
                            </div>

                          </div>
                        </div>
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