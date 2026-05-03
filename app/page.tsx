'use client';

import { Button, Row, Col, Card } from 'antd';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const features = [
  { title: 'Huge Selection', description: 'Browse every available property listing.', icon: '🏘️', href: '/properties' },
  { title: 'Secure & Safe', description: 'Verified listings with safe contact options.', icon: '🔒', href: '/properties' },
  { title: 'Easy Communication', description: 'Find the owner email and phone directly on the listing page.', icon: '💬', href: '/contact' },
  { title: 'Best Price', description: 'Show lower-priced homes first.', icon: '💲', href: '/properties?sort=priceAsc' },
  { title: 'Easy to Use', description: 'Browse listings with a clean interface.', icon: '📱', href: '/properties' },
  { title: 'Location Maps', description: 'Search nearby neighborhoods and areas.', icon: '🗺️', href: '/properties' },
];

export default function Home() {
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    axios.get('/api/properties?limit=4').then(res => {
      setFeaturedProperties(res.data.data || []);
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560185127-6c7c7a10fca5?auto=format&fit=crop&w=1600&q=80')" }} />
        <div className="absolute inset-0 bg-slate-950/75" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid gap-10 items-center lg:grid-cols-[1.2fr_0.8fr]">
            <div className="text-white">
              <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-100 shadow-sm">
                Premium property marketplace
              </span>
              <h1 className="mt-8 text-5xl md:text-6xl font-semibold leading-tight">
                Discover premium homes with confident ease.
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-slate-200">
                Easy Homes helps property buyers, sellers, and agents connect through a modern, reliable search experience. Browse verified listings, post listings quickly, and manage your portfolio with clarity.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/properties">
                  <Button type="primary" size="large" className="h-12 px-8">Browse Listings</Button>
                </Link>
                <Link href="/properties/add">
                  <Button size="large" className="h-12 px-8 text-slate-900 border-slate-900 bg-white hover:bg-slate-100">Post Your Property</Button>
                </Link>
              </div>
            </div>

            <div className="relative mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-2xl">
              <div className="relative h-72 overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950 sm:h-96">
                <Image
                  src="https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80"
                  alt="Modern home interior"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-900/90 p-4 text-slate-100">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Featured listing</p>
                  <p className="mt-3 text-lg font-semibold">Modern residence in the city</p>
                  <p className="mt-2 text-sm text-slate-400">3 beds • 2 baths • 185 m²</p>
                </div>
                <div className="rounded-3xl bg-slate-900/90 p-4 text-slate-100">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Quick search</p>
                  <p className="mt-3 text-lg font-semibold">Smart filters for every budget</p>
                  <p className="mt-2 text-sm text-slate-400">Save time and surface the best homes fast.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-4xl font-bold text-emerald-600">Featured properties</h2>
              <p className="mt-3 max-w-2xl text-gray-600">
                See a selection of homes ready to explore now. Each property includes the key details you need to compare and book a viewing.
              </p>
            </div>
            <Link href="/properties">
              <Button type="primary" size="large" className="h-12">View all properties</Button>
            </Link>
          </div>

          <Row gutter={[24, 24]} className="mt-8">
            {featuredProperties.map((property) => {
              const images = JSON.parse(property.images || '[]');
              const mainImage = images[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600';
              return (
                <Col key={property.id} xs={24} sm={12} lg={6}>
                  <Link href={`/properties/${property.id}`} className="block">
                    <Card hoverable className="rounded-[1.5rem] overflow-hidden shadow-lg">
                      <div className="relative h-48 overflow-hidden bg-slate-100">
                        <Image
                          src={mainImage}
                          alt={property.title}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
                        <p className="text-sm text-gray-500 mb-4">{property.location}</p>
                        <div className="flex flex-wrap gap-3 text-sm text-slate-600 mb-3">
                          <span><strong>Type:</strong> {property.type}</span>
                          <span><strong>Beds:</strong> {property.bedrooms}</span>
                          <span><strong>Baths:</strong> {property.bathrooms}</span>
                          <span><strong>Area:</strong> {property.area} m²</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-lg font-bold text-emerald-600">${property.price.toLocaleString()}</p>
                          <span className={`rounded-full px-3 py-1 text-sm font-semibold ${property.status === 'SOLD' ? 'bg-red-100 text-red-700' : property.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                            {property.status === 'SOLD' ? 'Sold' : property.status === 'AVAILABLE' ? 'Available' : 'Rented'}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </Col>
              );
            })}
          </Row>
        </div>
      </section>

      {/* Feature Links Section */}
      <section className="bg-emerald-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm uppercase tracking-[0.28em] font-semibold text-emerald-700 mb-4">Browse by what matters most</p>
          <h2 className="text-4xl font-bold text-emerald-900 text-center mb-10">Find the features that match your ideal home</h2>
          <Row gutter={[24, 24]}>
            {features.map((feature) => (
              <Col key={feature.title} xs={24} sm={12} md={8}>
                <Link href={feature.href} className="block h-full">
                  <Card hoverable className="h-full rounded-[1.5rem] border-0 shadow-lg transition-transform hover:-translate-y-1">
                    <div className="text-5xl mb-5 text-emerald-600">{feature.icon}</div>
                    <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-emerald-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-emerald-100">
            Join thousands of users buying, selling, and renting properties on Easy Homes
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/properties">
              <Button type="primary" size="large" className="h-12">Browse Properties</Button>
            </Link>
            <Link href="/auth/signin">
              <Button size="large" className="h-12">Sign In</Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}