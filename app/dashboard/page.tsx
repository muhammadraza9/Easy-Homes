'use client';

import { useState, useEffect } from 'react';
import { Tabs, Card, Table, Row, Col, Statistic, Button, Empty, Spin, message } from 'antd';
import { UserOutlined, HomeOutlined, HeartOutlined, MessageOutlined } from '@ant-design/icons';
import Link from 'next/link';
import axios from 'axios';
import RequireAuth from '@/app/components/RequireAuth';
import { useSession } from 'next-auth/react';
import PropertyCard from '@/app/components/PropertyCard';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('properties');
  const [properties, setProperties] = useState<any[]>([]);
  const [savedProperties, setSavedProperties] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;
    if (status !== 'authenticated') {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [propsRes, savedRes, msgsRes] = await Promise.all([
          axios.get('/api/user/properties'),
          axios.get('/api/user/saved'),
          axios.get('/api/messages'),
        ]);

        setProperties(propsRes.data);
        setSavedProperties(savedRes.data);
        setMessages(msgsRes.data);
      } catch (error) {
        message.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status]);

  const handleDeleteProperty = (propertyId: string) => {
    setProperties(properties.filter(p => p.id !== propertyId));
  };

  if (loading) return <Spin size="large" className="block mx-auto mt-20" />;

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">📊 My Dashboard</h1>

          <Row gutter={[24, 24]} className="mb-8">
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="My Properties"
                  value={properties.length}
                  prefix={<HomeOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Saved Properties"
                  value={savedProperties.length}
                  prefix={<HeartOutlined />}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Messages"
                  value={messages.filter(m => !m.isRead).length}
                  prefix={<MessageOutlined />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Profile"
                  value={session?.user?.name || 'User'}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
          </Row>

          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: 'properties',
                label: '🏠 My Properties',
                children: (
                  <div className="space-y-4">
                    {properties.length === 0 ? (
                      <Empty description="No properties posted yet">
                        <Link href="/properties/add">
                          <Button type="primary">Post a Property</Button>
                        </Link>
                      </Empty>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {properties.map((property) => (
                          <PropertyCard
                            key={property.id}
                            property={property}
                            isOwner={true}
                            onDelete={handleDeleteProperty}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ),
              },
              {
                key: 'saved',
                label: '❤️ Saved Properties',
                children: (
                  <div className="space-y-4">
                    {savedProperties.length === 0 ? (
                      <Empty description="No saved properties">
                        <Link href="/properties">
                          <Button type="primary">Browse Properties</Button>
                        </Link>
                      </Empty>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedProperties.map((property) => (
                          <PropertyCard key={property.id} property={property} isSaved={true} />
                        ))}
                      </div>
                    )}
                  </div>
                ),
              },
              {
                key: 'messages',
                label: '💬 Messages',
                children: (
                  <div>
                    {messages.length === 0 ? (
                      <Empty description="No messages yet" />
                    ) : (
                      <Table
                        columns={[
                          {
                            title: 'From',
                            dataIndex: ['sender', 'name'],
                            key: 'sender',
                          },
                          {
                            title: 'To',
                            dataIndex: ['receiver', 'name'],
                            key: 'receiver',
                          },
                          {
                            title: 'Message',
                            dataIndex: 'content',
                            key: 'content',
                            ellipsis: true,
                          },
                          {
                            title: 'Date',
                            dataIndex: 'createdAt',
                            key: 'createdAt',
                            render: (date) => new Date(date).toLocaleDateString(),
                          },
                        ]}
                        dataSource={messages}
                        rowKey="id"
                        pagination={false}
                      />
                    )}
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
    </RequireAuth>
  );
}
