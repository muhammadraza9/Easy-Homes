'use client';

import { Button, Card, Col, Row, Typography } from 'antd';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-5xl mx-auto px-4">
        <Card className="rounded-3xl border-0 shadow-xl">
          <div className="space-y-8">
            <div>
              <Title>Contact Easy Homes</Title>
              <Paragraph className="text-lg text-slate-600">
                Need help with listings, communication, or pricing? Reach us directly via email or phone.
              </Paragraph>
              <Paragraph className="text-lg text-slate-600">
                For owner-specific contact details, open any listing and use the owner email or phone number shown on the property page.
              </Paragraph>
            </div>

            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <div className="rounded-3xl bg-emerald-950 p-8 text-white">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Email</p>
                  <p className="mt-3 text-2xl font-semibold">support@easyhomes.com</p>
                  <p className="mt-4 text-slate-300">Send us your questions about listings, messaging, or account setup.</p>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div className="rounded-3xl bg-emerald-950 p-8 text-white">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Phone</p>
                  <p className="mt-3 text-2xl font-semibold">+1 (800) 123-4567</p>
                  <p className="mt-4 text-slate-300">Available Monday through Friday, 9am–6pm.</p>
                </div>
              </Col>
            </Row>

            <div className="flex flex-wrap gap-4">
              <Link href="/properties">
                <Button type="primary" size="large" className="h-12 px-8">
                  Browse Properties
                </Button>
              </Link>
              <Link href="/properties/add">
                <Button size="large" className="h-12 px-8 text-slate-900 border-slate-900 bg-white hover:bg-slate-100">
                  Post a Listing
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
