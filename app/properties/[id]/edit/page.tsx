'use client';

import { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Select, Button, message, Card, Skeleton, Row, Col } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import RequireAuth from '@/app/components/RequireAuth';
import { Property } from '@/types/property';

interface EditPropertyPageProps {
  params: { id: string };
}

export default function EditPropertyPage({ params }: EditPropertyPageProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`/api/properties/${params.id}`);
        setProperty(response.data);
        form.setFieldsValue(response.data);
      } catch (error) {
        message.error('Failed to fetch property');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [params.id, form]);

  const handleSubmit = async (values: any) => {
    try {
      setSubmitting(true);
      await axios.put(`/api/properties/${params.id}`, values);
      message.success('Property updated successfully!');
      router.push(`/properties/${params.id}`);
    } catch (error: any) {
      message.error(error.response?.data?.error || 'Failed to update property');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Skeleton active />;

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Card>
            <h1 className="text-3xl font-bold mb-8">✏️ Edit Property</h1>

            <Form form={form} onFinish={handleSubmit} layout="vertical">
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="title"
                    label="Property Title"
                    rules={[{ required: true, message: 'Please enter property title' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="type"
                    label="Property Type"
                    rules={[{ required: true, message: 'Please select property type' }]}
                  >
                    <Select
                      options={[
                        { label: 'Apartment', value: 'APARTMENT' },
                        { label: 'House', value: 'HOUSE' },
                        { label: 'Villa', value: 'VILLA' },
                        { label: 'Condo', value: 'CONDO' },
                        { label: 'Land', value: 'LAND' },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: 'Please enter property description' }]}
              >
                <Input.TextArea rows={6} />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} md={6}>
                  <Form.Item
                    name="price"
                    label="Price"
                    rules={[{ required: true, message: 'Please enter price' }]}
                  >
                    <InputNumber prefix="$" min={0} className="w-full" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item
                    name="bedrooms"
                    label="Bedrooms"
                    rules={[{ required: true, message: 'Please enter number of bedrooms' }]}
                  >
                    <InputNumber min={0} className="w-full" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item
                    name="bathrooms"
                    label="Bathrooms"
                    rules={[{ required: true, message: 'Please enter number of bathrooms' }]}
                  >
                    <InputNumber min={0} className="w-full" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item name="area" label="Area (m²)">
                    <InputNumber min={0} className="w-full" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="location"
                    label="Location"
                    rules={[{ required: true, message: 'Please enter location' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="status"
                    label="Status"
                    rules={[{ required: true, message: 'Please select status' }]}
                  >
                    <Select
                      options={[
                        { label: 'Available', value: 'AVAILABLE' },
                        { label: 'Sold', value: 'SOLD' },
                        { label: 'Rented', value: 'RENTED' },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  size="large"
                  className="w-full"
                >
                  Update Property
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </RequireAuth>
  );
}
