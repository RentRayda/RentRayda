import { Image } from 'expo-image';
import { StyleProp, ImageStyle } from 'react-native';

const BLURHASH_PLACEHOLDER = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

interface OptimizedImageProps {
  uri: string | null;
  style: StyleProp<ImageStyle>;
  contentFit?: 'cover' | 'contain' | 'fill';
}

export function OptimizedImage({ uri, style, contentFit = 'cover' }: OptimizedImageProps) {
  if (!uri) return null;

  return (
    <Image
      source={{ uri }}
      style={style}
      contentFit={contentFit}
      cachePolicy="memory-disk"
      placeholder={{ blurhash: BLURHASH_PLACEHOLDER }}
      transition={200}
      recyclingKey={uri}
    />
  );
}
