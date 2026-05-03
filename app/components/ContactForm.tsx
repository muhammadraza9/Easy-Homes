'use client';

import { useState } from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import axios from 'axios';

interface ContactFormProps {
  propertyId?: string;
  recipientId?: string;
}

export default function ContactForm({ propertyId, recipientId }: ContactFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      await axios.post('/api/messages', {
        content: values.message,
        propertyId,
        recipientId,
      });
      message.success('Message sent successfully!');
      form.resetFields();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6">💬 Send a Message</h2>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="message"
          label="Message"
          rules={[{ required: true, message: 'Please enter your message' }]}
        >
          <Input.TextArea
            placeholder="Write your message here..."
            rows={4}
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          size="large"
          icon={<SendOutlined />}
        >
          Send Message
        </Button>
      </Form>
    </Card>
  );
}
