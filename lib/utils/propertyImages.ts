const normalizeImageString = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) return '';
  let normalized = trimmed.replace(/\\/g, '/').trim();
  normalized = normalized.replace(/^https?:\/+(?!\/)/i, (match) => match.replace(/:\/+/, '://'));
  const lower = normalized.toLowerCase();
  if (lower.startsWith('http') || lower.startsWith('data:') || lower.startsWith('//')) return normalized;
  if (lower.startsWith('www.')) return `https://${normalized}`;
  return normalized;
};

const looksLikeBase64Image = (value: string) => {
  const cleaned = value.replace(/\s+/g, '');
  if (cleaned.length < 100) return false;
  if (!/^[A-Za-z0-9+/=]+$/.test(cleaned)) return false;
  return cleaned.length % 4 === 0;
};

const decodeBase64Image = (base64: string): Uint8Array | null => {
  const cleaned = base64.replace(/\s+/g, '');
  try {
    if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function') {
      return Buffer.from(cleaned, 'base64');
    }
    if (typeof atob === 'function') {
      const binary = atob(cleaned);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes;
    }
  } catch {
    return null;
  }
  return null;
};

const detectImageMimeType = (base64: string): string | null => {
  const bytes = decodeBase64Image(base64);
  if (!bytes || bytes.length < 4) return null;
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return 'image/png';
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) return 'image/gif';
  if (bytes[0] === 0x42 && bytes[1] === 0x4d) return 'image/bmp';
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return 'image/webp';
  }
  return null;
};

const toDataImageUri = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.toLowerCase().startsWith('data:image/')) return trimmed;
  if (!looksLikeBase64Image(trimmed)) return null;
  const mime = detectImageMimeType(trimmed) || 'image/png';
  return `data:${mime};base64,${trimmed.replace(/\s+/g, '')}`;
};

const extractUrlFromText = (text: string): string | null => {
  const cleaned = text.trim();
  const urlMatch = cleaned.match(/(https?:\/\/|www\.)[\w\-./?=&%#]+/gi);
  if (urlMatch && urlMatch.length > 0) {
    return normalizeImageString(urlMatch[0]);
  }
  const fileMatch = cleaned.match(/[\w\-./]+\.(jpg|jpeg|png|gif|webp|svg|avif|bmp)(\?|$)/i);
  if (fileMatch) {
    return normalizeImageString(fileMatch[0]);
  }
  return null;
};

const tryExtractImageUrl = (value: string): string | null => {
  const normalized = normalizeImageString(value);
  if (!normalized) return null;
  const dataUri = toDataImageUri(normalized);
  if (dataUri) return dataUri;
  if (isValidImageUrl(normalized)) return normalized;
  const extracted = extractUrlFromText(normalized);
  if (extracted) return extracted;
  return null;
};

export const extractImageUrl = (item: unknown): string | null => {
  if (typeof item === 'string') {
    return tryExtractImageUrl(item);
  }

  if (typeof item === 'object' && item !== null) {
    const obj = item as Record<string, unknown>;
    const candidates = ['url', 'secure_url', 'secureUrl', 'image', 'src', 'path', 'uri', 'imageUrl', 'thumbnail', 'thumbnailUrl'];
    for (const key of candidates) {
      const value = obj[key];
      if (typeof value === 'string' && value.trim().length > 0) {
        const extracted = tryExtractImageUrl(value);
        if (extracted) return extracted;
      }
    }

    for (const value of Object.values(obj)) {
      if (typeof value === 'string' && value.trim().length > 0) {
        const extracted = tryExtractImageUrl(value);
        if (extracted) return extracted;
      }
    }
    for (const value of Object.values(obj)) {
      const nested = extractImageUrl(value);
      if (nested) return nested;
    }
  }

  return null;
};

export const isValidImageUrl = (url: string) => {
  const normalized = normalizeImageString(url);
  if (!normalized) return false;
  const lowerValue = normalized.toLowerCase();
  if (lowerValue.startsWith('http') || lowerValue.startsWith('data:') || lowerValue.startsWith('//')) return true;
  if (lowerValue.startsWith('/') || lowerValue.startsWith('./') || lowerValue.startsWith('../')) return true;
  return /[\w\-./]+\.(jpg|jpeg|png|gif|webp|svg|avif|bmp)(\?|$)/i.test(normalized);
};

const flattenImageCandidates = (data: unknown): string[] => {
  if (Array.isArray(data)) {
    return data.flatMap(flattenImageCandidates);
  }
  if (typeof data === 'object' && data !== null) {
    const obj = data as Record<string, unknown>;
    return Object.values(obj).flatMap(flattenImageCandidates);
  }
  if (typeof data === 'string') {
    const extracted = tryExtractImageUrl(data);
    return extracted ? [extracted] : [];
  }
  return [];
};

export const sanitizePropertyImages = (raw: string | string[] | unknown): string[] => {
  let images: string[] = [];

  if (Array.isArray(raw)) {
    images = raw
      .flatMap((item) => {
        const extracted = extractImageUrl(item);
        return extracted ? [extracted] : [];
      })
      .filter((img): img is string => Boolean(img) && isValidImageUrl(img));
  } else if (typeof raw === 'object' && raw !== null) {
    images = flattenImageCandidates(raw).filter((img) => isValidImageUrl(img));
  } else {
    const value = typeof raw === 'string' ? raw.trim() : '';
    if (!value) return [];

    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        images = parsed
          .flatMap((item) => {
            const extracted = extractImageUrl(item);
            return extracted ? [extracted] : [];
          })
          .filter((img): img is string => Boolean(img) && isValidImageUrl(img));
      } else if (typeof parsed === 'string') {
        const candidate = tryExtractImageUrl(parsed);
        images = candidate ? [candidate] : [];
      } else if (typeof parsed === 'object' && parsed !== null) {
        images = flattenImageCandidates(parsed).filter((img) => isValidImageUrl(img));
      }
    } catch {
      const items = value
        .split(/[\s,;|]+/)
        .map((item) => item.replace(/^['"]|['"]$/g, '').trim())
        .map(tryExtractImageUrl)
        .filter((img): img is string => Boolean(img));
      images = items;
    }
  }

  return Array.from(new Set(images));
};
