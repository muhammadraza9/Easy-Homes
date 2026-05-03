'use client';

import { useState } from 'react';
import { Form, Input, InputNumber, Select, Button, message, Card, Upload, Row, Col } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import RequireAuth from '@/app/components/RequireAuth';
import { useSession } from 'next-auth/react';

export default function AddPropertyPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleBeforeUpload = (file: any) => {
    const reader = new FileReader();
    reader.onload = () => {
      setFileList((prev) => [
        ...prev,
        {
          uid: file.uid,
          name: file.name,
          status: 'done',
          url: reader.result,
        },
      ]);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleRemove = (file: any) => {
    setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
    return true;
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      await axios.post('/api/properties', {
        ...values,
        images: fileList.map((file) => file.url),
      });
      message.success('Property posted successfully!');
      router.push('/properties');
    } catch (error: any) {
      message.error(error.response?.data?.error || 'Failed to post property');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') return <div>Loading...</div>;

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Card>
            <h1 className="text-3xl font-bold mb-8">📝 Post a New Property</h1>

            <Form form={form} onFinish={handleSubmit} layout="vertical">
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="title"
                    label="Property Title"
                    rules={[{ required: true, message: 'Please enter property title' }]}
                  >
                    <Input placeholder="e.g., Beautiful 3BR House in Downtown" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="type"
                    label="Property Type"
                    rules={[{ required: true, message: 'Please select property type' }]}
                  >
                    <Select
                      placeholder="Select type"
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
                <Input.TextArea rows={6} placeholder="Describe your property..." />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} md={6}>
                  <Form.Item
                    name="price"
                    label="Price"
                    rules={[{ required: true, message: 'Please enter price' }]}
                  >
                    <InputNumber
                      prefix="$"
                      placeholder="0"
                      min={0}
                      className="w-full"
                    />
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
                    <Input placeholder="City, Address" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="status" label="Status" initialValue="AVAILABLE">
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

              <Form.Item label="Property Images">
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  beforeUpload={handleBeforeUpload}
                  onRemove={handleRemove}
                  accept="image/*"
                  multiple
                >
                  {fileList.length >= 6 ? null : (
                    <div>
                      <Button type="default">📸 Upload Images</Button>
                    </div>
                  )}
                </Upload>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  className="w-full"
                >
                  Post Property
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </RequireAuth>
  );
}
