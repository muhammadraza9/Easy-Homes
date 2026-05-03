interface PropertyMapProps {
  latitude: number;
  longitude: number;
  title: string;
}

export default function PropertyMap({ latitude, longitude, title }: PropertyMapProps) {
  return (
    <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
      <p className="text-gray-600">{title} — {latitude}, {longitude}</p>
    </div>
  );
}