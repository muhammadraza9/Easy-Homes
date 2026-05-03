'use client';

import { useState } from 'react';
import { Input, Select, Button, Row, Col, Card } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface SearchFilters {
  search: string;
  type: string;
  minPrice: number | null;
  maxPrice: number | null;
  bedrooms: number | null;
}

interface SearchPropertiesProps {
  onSearch: (filters: SearchFilters) => void;
  loading?: boolean;
}

export default function SearchProperties({ onSearch, loading = false }: SearchPropertiesProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    type: '',
    minPrice: null,
    maxPrice: null,
    bedrooms: null,
  });

  const handleSearch = () => {
    onSearch(filters);
  };

  return (
    <Card className="mb-8 shadow-md">
      <h2 className="text-2xl font-bold mb-6">🔍 Find Your Perfect Home</h2>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Input
            placeholder="Search by location or title"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            prefix={<SearchOutlined />}
          />
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Select
            placeholder="Property Type"
            allowClear
            onChange={(value) => setFilters({ ...filters, type: value || '' })}
            options={[
              { label: 'Apartment', value: 'APARTMENT' },
              { label: 'House', value: 'HOUSE' },
              { label: 'Villa', value: 'VILLA' },
              { label: 'Condo', value: 'CONDO' },
              { label: 'Land', value: 'LAND' },
            ]}
          />
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Input
            type="number"
            placeholder="Min Price"
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value ? parseInt(e.target.value) : null })}
          />
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Input
            type="number"
            placeholder="Max Price"
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value ? parseInt(e.target.value) : null })}
          />
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Select
            placeholder="Bedrooms"
            allowClear
            onChange={(value) => setFilters({ ...filters, bedrooms: value || null })}
            options={[
              { label: '1+', value: 1 },
              { label: '2+', value: 2 },
              { label: '3+', value: 3 },
              { label: '4+', value: 4 },
              { label: '5+', value: 5 },
            ]}
          />
        </Col>

        <Col xs={24} sm={24} md={18}>
          <Button
            type="primary"
            size="large"
            block
            loading={loading}
            onClick={handleSearch}
            icon={<SearchOutlined />}
          >
            Search Properties
          </Button>
        </Col>
      </Row>
    </Card>
  );
}
