import { redirect } from 'next/navigation';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';

import prisma from '@/lib/prisma';

export default async function PropertyDetailPage({
  params,
}: {
  params: { id: string };
}) {

  /* LOGIN CHECK */

  const session =
    await getServerSession(authOptions);

  /* IF NOT LOGIN */

  if (!session) {

    redirect(
      `/api/auth/signin?callbackUrl=/property/${params.id}`
    );
  }

  /* GET PROPERTY */

  const property =
    await prisma.property.findUnique({

      where: {
        id: params.id,
      },
    });

  if (!property) {

    return <div>Property not found</div>;
  }

  /* IMAGE */

  let images: string[] = [];

  try {

    images =
      typeof property.images === 'string'
        ? JSON.parse(property.images)
        : property.images || [];

  } catch {

    images = [];
  }

  const image =
    images[0] ||
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80';

  return (

    <div className="max-w-6xl mx-auto p-10">

      <img
        src={image}
        alt={property.title}
        className="w-full h-[500px] object-cover rounded-xl"
      />

      <h1 className="text-4xl font-bold mt-5">
        {property.title}
      </h1>

      <h2 className="text-2xl text-green-600 mt-3">
        PKR {property.price}
      </h2>

      <p className="mt-5 text-lg">
        {property.description}
      </p>

      <div className="mt-5">
        <strong>Location:</strong>{' '}
        {property.location}
      </div>

    </div>
  );
}