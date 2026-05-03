'use client';

import { useEffect, useState } from 'react';
import { Button, Col, Input, message, Row, Skeleton, Typography } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PropertyCard from '@/app/components/PropertyCard';
import { Property } from '@/types/property';

const { Title, Paragraph } = Typography;

export default function PropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');

  const fetchProperties = async (query: string, sortOrder = '') => {
    setLoading(true);
    try {
      const url = `/api/properties?search=${encodeURIComponent(query)}&limit=10${sortOrder ? `&sort=${encodeURIComponent(sortOrder)}` : ''}`;
      const response = await axios.get(url);
      setProperties(response.data.data || []);
    } catch (error) {
      message.error('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('search') || '';
    const sortOrder = params.get('sort') || '';
    setSearch(query);
    setSort(sortOrder);
    fetchProperties(query, sortOrder);
  }, []);

  const handleSearch = () => {
    const query = search || '';
    const queryString = `/properties?search=${encodeURIComponent(query)}&limit=10${sort ? `&sort=${encodeURIComponent(sort)}` : ''}`;
    router.push(queryString);
    fetchProperties(query, sort);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8 space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <Title level={2}>Browse Properties</Title>
              <Paragraph type="secondary">
                View available homes, save your favorites, and connect with agents.
              </Paragraph>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onPressEnter={handleSearch}
                placeholder="Search by location or property title"
                className="min-w-65"
                suffix={<SearchOutlined />}
              />
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                Search
              </Button>
              <Link href="/properties/add">
                <Button icon={<PlusOutlined />}>Add Property</Button>
              </Link>
            </div>
          </div>

          {loading ? (
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : properties.length === 0 ? (
            <div className="rounded-lg bg-white p-10 text-center shadow-sm">
              <Title level={4}>No properties found</Title>
              <Paragraph type="secondary">Try another search or add a new property.</Paragraph>
              <Link href="/properties/add">
                <Button type="primary">Add Property</Button>
              </Link>
            </div>
          ) : (
            <Row gutter={[24, 24]}>
              {properties.map((property) => (
                <Col key={property.id} xs={24} sm={12} lg={8}>
                  <PropertyCard property={property} />
                </Col>
              ))}
            </Row>
          )}
        </div>
      </div>
    </div>
  );
}
