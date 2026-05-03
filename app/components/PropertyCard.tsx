'use client';

import Link from 'next/link';
import { Card, Button, Tag, Space, Popconfirm, message } from 'antd';
import {
  HeartOutlined,
  HeartFilled,
  EditOutlined,
  DeleteOutlined,
  MessageOutlined,
  EnvironmentOutlined,
  BgColorsOutlined,
  CopyOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { Property } from '@/types/property';
import { sanitizePropertyImages } from '@/lib/utils/propertyImages';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

interface PropertyCardProps {
  property: Property;
  isSaved?: boolean;
  isOwner?: boolean;
  onSaveToggle?: (id: string, saved: boolean) => void;
  onDelete?: (id: string) => void;
}

export default function PropertyCard({
  property,
  isSaved = false,
  isOwner = false,
  onSaveToggle,
  onDelete,
}: PropertyCardProps) {
  const [saved, setSaved] = useState(isSaved);
  const [loading, setLoading] = useState(false);
  const fallbackImages = [
    'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1560185127-6c7c7a10fca5?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1465188162913-8fb2b6a7d66d?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80',
  ];

  const images = useMemo(() => sanitizePropertyImages(property.images || property.image || ''), [property.images, property.image]);
  const fallbackImage = fallbackImages[
    [...property.id].reduce((sum, char) => sum + char.charCodeAt(0), 0) % fallbackImages.length
  ];
  const titleFallbackImages: Record<string, string> = {
    'Garden Cottage': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    'Lakehouse Escape': 'https://images.unsplash.com/photo-1465188162913-8fb2b6a7d66d?auto=format&fit=crop&w=900&q=80',
  };
  const imageUrls = images.length > 0 ? images : [property.image || titleFallbackImages[property.title] || fallbackImage];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [JSON.stringify(images), fallbackImage]);

  const currentImage = currentImageIndex < imageUrls.length ? imageUrls[currentImageIndex] : fallbackImage;
  const statusColor = property.status === 'AVAILABLE' ? 'green' : property.status === 'SOLD' ? 'red' : 'orange';
  const statusLabel =
    property.status === 'SOLD' ? 'Sold' : property.status === 'RENTED' ? 'Rented' : 'Available';
  const priceText = new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(property.price);
  const statusIcon =
    property.status === 'AVAILABLE'
      ? <CheckCircleOutlined />
      : property.status === 'SOLD'
      ? <CloseCircleOutlined />
      : <ClockCircleOutlined />;

  const handleSaveToggle = async () => {
    try {
      setLoading(true);
      if (saved) {
        await axios.delete(`/api/properties/${property.id}/save`);
        setSaved(false);
      } else {
        await axios.post(`/api/properties/${property.id}/save`);
        setSaved(true);
      }
      onSaveToggle?.(property.id, !saved);
      message.success(saved ? 'Removed from saved' : 'Added to saved');
    } catch (error) {
      message.error('Failed to save property');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/properties/${property.id}`);
      onDelete?.(property.id);
      message.success('Property deleted');
    } catch (error) {
      message.error('Failed to delete property');
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = () => {
    setCurrentImageIndex((prev) => Math.min(prev + 1, imageUrls.length));
  };

  return (
    <Card
      hoverable
      className="h-full shadow-lg hover:shadow-xl transition-shadow"
      cover={
        <div className="relative h-64 bg-gray-200">
          <img
            src={currentImage}
            alt={property.title}
            onError={handleImageError}
            className="h-full w-full object-cover"
          />
          <div className="absolute top-3 right-3 flex flex-wrap gap-2">
            {property.featured && <Tag color="gold">Featured</Tag>}
            <Tag color="cyan">{property.type}</Tag>
            <Tag color={statusColor} icon={statusIcon}>
              {statusLabel}
            </Tag>
          </div>
        </div>
      }
      actions={[
        <Button
          type="text"
          icon={saved ? <HeartFilled className="text-red-500" /> : <HeartOutlined />}
          loading={loading}
          onClick={handleSaveToggle}
          disabled={isOwner}
        />,
        <Link href={`/properties/${property.id}`} prefetch>
          <Button type="text" icon={<CopyOutlined />} />
        </Link>,
        isOwner ? (
          <Link href={`/properties/${property.id}/edit`}>
            <Button type="text" icon={<EditOutlined />} />
          </Link>
        ) : (
          <Link href={`/contact?propertyId=${property.id}`}>
            <Button type="text" icon={<MessageOutlined />} />
          </Link>
        ),
        isOwner && (
          <Popconfirm
            title="Delete Property"
            description="Are you sure you want to delete this property?"
            onConfirm={handleDelete}
          >
            <Button type="text" danger icon={<DeleteOutlined />} loading={loading} />
          </Popconfirm>
        ),
      ]}
    >
      <Card.Meta
        title={
          <Link href={`/properties/${property.id}`} prefetch>
            <h3 className="text-lg font-bold hover:text-emerald-600 transition">{property.title}</h3>
          </Link>
        }
        description={
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600">
              <EnvironmentOutlined />
              <span>{property.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <BgColorsOutlined />
              <span>{property.bedrooms} BD • {property.bathrooms} BA • {property.area} m²</span>
            </div>
            <p className="text-gray-600 line-clamp-2">{property.description}</p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-2xl font-bold text-emerald-600">{priceText}</span>
              <Tag color={statusColor}>{statusLabel}</Tag>
            </div>
          </div>
        }
      />
    </Card>
  );
}
