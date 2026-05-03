const { PrismaClient } = require('@prisma/client');

const normalizeImageString = (value) => {
  const trimmed = String(value).trim();
  if (!trimmed) return '';
  let normalized = trimmed.replace(/\\/g, '/').trim();
  normalized = normalized.replace(/^https?:\/+(?!\/)/i, (match) => match.replace(/:\/+/,'://'));
  const lower = normalized.toLowerCase();
  if (lower.startsWith('http') || lower.startsWith('data:') || lower.startsWith('//')) return normalized;
  if (lower.startsWith('www.')) return `https://${normalized}`;
  return normalized;
};

const isValidImageUrl = (url) => {
  const normalized = normalizeImageString(String(url));
  if (!normalized) return false;
  const lowerValue = normalized.toLowerCase();
  if (lowerValue.startsWith('http') || lowerValue.startsWith('data:') || lowerValue.startsWith('//')) return true;
  if (lowerValue.startsWith('/') || lowerValue.startsWith('./') || lowerValue.startsWith('../')) return true;
  return /[\w\-./]+\.(jpg|jpeg|png|gif|webp|svg|avif|bmp)(\?|$)/i.test(normalized);
};

const extractUrlFromText = (text) => {
  const cleaned = String(text).trim();
  const urlMatch = cleaned.match(/(https?:\/\/|www\.)[\w\-./?=&%#]+/gi);
  if (urlMatch && urlMatch.length > 0) return normalizeImageString(urlMatch[0]);
  const fileMatch = cleaned.match(/[\w\-./]+\.(jpg|jpeg|png|gif|webp|svg|avif|bmp)(\?|$)/i);
  if (fileMatch) return normalizeImageString(fileMatch[0]);
  return null;
};

const extractImageUrl = (item) => {
  if (typeof item === 'string') {
    const normalized = normalizeImageString(item);
    if (isValidImageUrl(normalized)) return normalized;
    return extractUrlFromText(normalized);
  }
  if (typeof item === 'object' && item !== null) {
    const candidates = ['url','secure_url','secureUrl','image','src','path','uri','imageUrl','thumbnail','thumbnailUrl'];
    for (const key of candidates) {
      const value = item[key];
      if (typeof value === 'string' && value.trim()) {
        const normalized = normalizeImageString(value);
        if (isValidImageUrl(normalized)) return normalized;
        const extracted = extractUrlFromText(normalized);
        if (extracted) return extracted;
      }
    }
    for (const value of Object.values(item)) {
      if (typeof value === 'string' && value.trim()) {
        const normalized = normalizeImageString(value);
        if (isValidImageUrl(normalized)) return normalized;
        const extracted = extractUrlFromText(normalized);
        if (extracted) return extracted;
      }
    }
    for (const value of Object.values(item)) {
      const nested = extractImageUrl(value);
      if (nested) return nested;
    }
  }
  return null;
};

const flattenImageCandidates = (data) => {
  if (Array.isArray(data)) return data.flatMap(flattenImageCandidates);
  if (typeof data === 'object' && data !== null) return Object.values(data).flatMap(flattenImageCandidates);
  if (typeof data === 'string') {
    const extracted = extractImageUrl(data);
    return extracted ? [extracted] : [];
  }
  return [];
};

const sanitizePropertyImages = (raw) => {
  let images = [];
  if (Array.isArray(raw)) {
    images = raw.flatMap((item) => {
      const extracted = extractImageUrl(item);
      return extracted ? [extracted] : [];
    }).filter((img) => Boolean(img) && isValidImageUrl(img));
  } else if (typeof raw === 'object' && raw !== null) {
    images = flattenImageCandidates(raw).filter((img) => isValidImageUrl(img));
  } else {
    const value = typeof raw === 'string' ? raw.trim() : '';
    if (!value) return [];
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        images = parsed.flatMap((item) => {
          const extracted = extractImageUrl(item);
          return extracted ? [extracted] : [];
        }).filter((img) => Boolean(img) && isValidImageUrl(img));
      } else if (typeof parsed === 'string') {
        const candidate = extractImageUrl(parsed);
        images = candidate ? [candidate] : [];
      } else if (typeof parsed === 'object' && parsed !== null) {
        images = flattenImageCandidates(parsed).filter((img) => isValidImageUrl(img));
      }
    } catch {
      images = value.split(/[\s,;|]+/).map((item) => extractImageUrl(item)).filter((img) => Boolean(img));
    }
  }
  return Array.from(new Set(images));
};

(async () => {
  const prisma = new PrismaClient();
  try {
    const props = await prisma.property.findMany();
    const missing = props.filter((p) => {
      const images = sanitizePropertyImages(p.images || p.image || '');
      return images.length === 0;
    });
    missing.forEach((p) => {
      console.log(`${p.id} | ${p.title} | images=${JSON.stringify(p.images)} | image=${p.image}`);
    });
    console.log(`TOTAL_MISSING=${missing.length}`);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
})();
