'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

import { Row, Col, Skeleton, Button } from 'antd';
import {
  EnvironmentOutlined,
  HomeOutlined,
  BankOutlined,
  HeartFilled,
  HeartOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const toggleSave = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  useEffect(() => {
    axios
      .get('/api/properties?limit=12')
      .then((res) => {
        if (Array.isArray(res.data)) setProperties(res.data);
        else if (Array.isArray(res.data.data)) setProperties(res.data.data);
        else setProperties([]);
      })
      .catch(() => setProperties([])
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: '40px 24px', background: '#f3f4f6', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1300, margin: '0 auto' }}>

        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 32, color: '#111827' }}>
          All Properties
        </h1>

        <Row gutter={[24, 40]}>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Col key={i} xs={24} sm={12} lg={6}>
                  <div style={{ background: '#fff', borderRadius: 14, padding: 16, border: '1px solid #e5e7eb' }}>
                    <Skeleton.Image active style={{ width: '100%', height: 180, borderRadius: 10, marginBottom: 12 }} />
                    <Skeleton active paragraph={{ rows: 3 }} />
                  </div>
                </Col>
              ))
            : properties.map((property) => {
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
                  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=70';

                const isSaved = savedIds.has(property.id);

                return (
                  <Col key={property.id} xs={24} sm={12} lg={6}>
                    <Link href={`/property/${property.id}`} style={{ display: 'block' }}>
                      <div
                        style={{
                          position: 'relative',
                          borderRadius: 14,
                          background: '#fff',
                          border: '1px solid #e5e7eb',
                          boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                          overflow: 'visible',
                          cursor: 'pointer',
                          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.13)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        {/* IMAGE */}
                        <div style={{ borderRadius: '14px 14px 0 0', overflow: 'hidden', height: 200 }}>
                          <img
                            src={image}
                            alt={property.title}
                            loading="lazy"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block',
                            }}
                          />
                        </div>

                        {/* TYPE BADGE */}
                        {property.type && (
                          <div
                            style={{
                              position: 'absolute',
                              top: -14,
                              right: 14,
                              background: '#059669',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 5,
                              padding: '4px 12px',
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
                              <HomeOutlined style={{ fontSize: 12 }} />
                            ) : (
                              <BankOutlined style={{ fontSize: 12 }} />
                            )}
                            {property.type}
                          </div>
                        )}

                        {/* CARD BODY */}
                        <div style={{ padding: '18px 16px 16px' }}>
                          <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, color: '#111827' }}>
                            {property.title}
                          </h3>

                          <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 6 }}>
                            <EnvironmentOutlined style={{ color: '#059669', marginRight: 4 }} />
                            {property.location}
                          </p>

                          <p
                            style={{
                              color: '#4b5563',
                              fontSize: 13,
                              lineHeight: 1.6,
                              marginBottom: 12,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {property.description ||
                              'Beautiful property with modern architecture and premium facilities.'}
                          </p>

                          <p style={{ color: '#059669', fontWeight: 800, fontSize: 17, margin: '8px 0 12px' }}>
                            PKR {Number(property.price).toLocaleString('en-PK')}
                          </p>

                          {/* BUTTONS ROW */}
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <Button
                              type="primary"
                              block
                              icon={<ArrowRightOutlined />}
                              style={{
                                background: '#059669',
                                border: 'none',
                                fontWeight: 600,
                                fontSize: 13,
                              }}
                            >
                              View Details
                            </Button>

                            <button
                              onClick={(e) => toggleSave(e, property.id)}
                              title={isSaved ? 'Unsave' : 'Save'}
                              style={{
                                flexShrink: 0,
                                width: 38,
                                height: 38,
                                borderRadius: '50%',
                                border: `2px solid ${isSaved ? '#ef4444' : '#d1d5db'}`,
                                background: isSaved ? '#fef2f2' : '#fff',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease',
                                boxShadow: isSaved ? '0 0 0 3px rgba(239,68,68,0.15)' : 'none',
                              }}
                            >
                              {isSaved ? (
                                <HeartFilled style={{ fontSize: 16, color: '#ef4444' }} />
                              ) : (
                                <HeartOutlined style={{ fontSize: 16, color: '#9ca3af' }} />
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
    </div>
  );
}