'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

import { Row, Col, Card, Tag, Skeleton } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await axios.get('/api/properties?limit=30');

        if (Array.isArray(res.data)) {
          setProperties(res.data);
        } else if (Array.isArray(res.data.data)) {
          setProperties(res.data.data);
        } else {
          setProperties([]);
        }
      } catch (err) {
        console.log(err);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return (
    <div style={{ padding: 40, background: '#f8fafc' }}>
      <h1
        style={{
          fontSize: 34,
          fontWeight: 800,
          marginBottom: 20,
        }}
      >
        All Properties
      </h1>

      <Row gutter={[24, 24]}>
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Col key={i} xs={24} sm={12} lg={6}>
                <Card>
                  <Skeleton active />
                </Card>
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
                'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800';

              return (
                <Col key={property.id} xs={24} sm={12} lg={6}>
                  <Link href={`/property/${property.id}`}>
                    <Card
                      hoverable
                      style={{
                        borderRadius: 14,
                        overflow: 'hidden',
                        height: '100%',
                      }}
                      styles={{ body: { padding: 0 } }}
                    >
                      {/* PROPERTY IMAGE */}
                      <div
                        style={{
                          position: 'relative',
                          height: 200,
                        }}
                      >
                        <Image
                          src={image}
                          alt={property.title}
                          fill
                          style={{ objectFit: 'cover' }}
                          unoptimized
                        />

                        {property.type && (
                          <Tag
                            color="green"
                            style={{
                              position: 'absolute',
                              top: 10,
                              left: 10,
                              fontWeight: 700,
                            }}
                          >
                            {property.type}
                          </Tag>
                        )}
                      </div>

                      {/* PROPERTY DETAILS */}
                      <div style={{ padding: 14 }}>
                        <h3
                          style={{
                            fontWeight: 700,
                            fontSize: 18,
                            marginBottom: 6,
                          }}
                        >
                          {property.title}
                        </h3>

                        <p
                          style={{
                            color: '#6b7280',
                            fontSize: 13,
                            marginBottom: 10,
                          }}
                        >
                          <EnvironmentOutlined /> {property.location}
                        </p>

                        {/* PROPERTY DESCRIPTION */}
                        <p
                          style={{
                            color: '#4b5563',
                            fontSize: 13,
                            lineHeight: 1.6,
                            marginBottom: 14,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {property.description
                            ? property.description
                            : 'Beautiful property with modern architecture, spacious rooms, premium facilities, secure environment, and an excellent location perfect for comfortable family living.'}
                        </p>

                        {/* PROPERTY PRICE */}
                        <p
                          style={{
                            color: '#059669',
                            fontWeight: 800,
                            fontSize: 18,
                          }}
                        >
                          PKR{' '}
                          {Number(property.price).toLocaleString('en-PK')}
                        </p>
                      </div>
                    </Card>
                  </Link>
                </Col>
              );
            })}
      </Row>
    </div>
  );
}