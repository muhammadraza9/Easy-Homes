import { Card, Row, Col, Button, Divider, Tag } from 'antd';
import { MailOutlined, UserOutlined, EnvironmentOutlined, PhoneOutlined } from '@ant-design/icons';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Property } from '@/types/property';
import ContactForm from '@/app/components/ContactForm';
import { sanitizePropertyImages } from '@/lib/utils/propertyImages';

interface PropertyDetailPageProps {
  params: { id: string };
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(price);

async function getProperty(id: string): Promise<Property | null> {
  const property = await prisma.property.findUnique({
    where: { id },
    include: { user: true },
  });
  return property as Property | null;
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const property = await getProperty(params.id);
  if (!property) return <div>Property not found</div>;

  const images = sanitizePropertyImages(property.images || property.image || '');
  const fallbackImage = 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80';
  const mainImage = images.length > 0 ? images[0] : property.image || fallbackImage;
  const priceText = formatPrice(property.price);

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-6xl mx-auto px-4'>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={16}>
            <Card>
              <div className='space-y-4'>
                <div className='overflow-hidden rounded-3xl bg-slate-100 h-96'>
                  <img src={mainImage} alt={property.title} className='h-full w-full object-cover' />
                </div>
                <h1 className='text-3xl font-bold'>{property.title}</h1>
                <div className='flex items-center gap-4 flex-wrap'>
                  <Tag color='cyan'>{property.type}</Tag>
                  <Tag color={property.status === 'AVAILABLE' ? 'green' : 'red'}>{property.status}</Tag>
                </div>
                <div className='text-3xl font-bold text-emerald-600'>{priceText}</div>
                <Divider />
                <div className='flex items-start gap-2'>
                  <EnvironmentOutlined className='mt-1' />
                  <div>
                    <strong>Location</strong>
                    <p>{property.location}</p>
                  </div>
                </div>
                <div>
                  <strong>Description</strong>
                  <p>{property.description}</p>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card>
              <h2 className='text-2xl font-bold mb-6'>Property Details</h2>
              {property.user && (
                <div className='mb-6 p-4 bg-gray-50 rounded-lg'>
                  <div className='flex items-center gap-2'>
                    <UserOutlined />
                    <p className='font-semibold'>{property.user.name}</p>
                  </div>
                  <div className='flex items-center gap-2 text-emerald-600 mt-2'>
                    <MailOutlined />
                    <a href={`mailto:${property.user.email}`} className='font-medium'>{property.user.email}</a>
                  </div>
                  <div className='flex items-center gap-2 text-emerald-600 mt-2'>
                    <PhoneOutlined />
                    {property.user.phone ? (
                      <a href={`tel:${property.user.phone}`} className='font-medium'>{property.user.phone}</a>
                    ) : (
                      <span>Phone number not available</span>
                    )}
                  </div>
                </div>
              )}
              <ContactForm propertyId={property.id} recipientId={property.userId} />
              <Divider />
              <Link href='/properties'>
                <Button block type='default'>Back to Properties</Button>
              </Link>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}