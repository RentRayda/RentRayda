import { View } from 'react-native';

export function SkeletonCard() {
  return (
    <View
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        marginBottom: 16,
        overflow: 'hidden',
      }}
    >
      {/* Photo bone */}
      <View style={{ width: '100%', height: 192, backgroundColor: '#E5E7EB' }} />
      <View style={{ padding: 16 }}>
        {/* Title bone */}
        <View style={{ width: '50%', height: 20, backgroundColor: '#E5E7EB', borderRadius: 4 }} />
        {/* Meta bone */}
        <View style={{ width: '40%', height: 16, backgroundColor: '#E5E7EB', borderRadius: 4, marginTop: 8 }} />
        {/* Badge bone */}
        <View style={{ width: 96, height: 28, backgroundColor: '#E5E7EB', borderRadius: 9999, marginTop: 8 }} />
      </View>
    </View>
  );
}
