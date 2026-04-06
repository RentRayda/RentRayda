import { View } from 'react-native';

export function SkeletonCard() {
  return (
    <View
      style={{
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
        marginBottom: 16,
      }}
    >
      {/* Photo bone */}
      <View style={{ width: '100%', height: 208, backgroundColor: '#CED0D4' }} />
      <View style={{ padding: 16 }}>
        {/* Title bone */}
        <View style={{ width: '50%', height: 20, backgroundColor: '#CED0D4', borderRadius: 4 }} />
        {/* Meta bone */}
        <View style={{ width: '40%', height: 16, backgroundColor: '#CED0D4', borderRadius: 4, marginTop: 8 }} />
        {/* Badge bone */}
        <View style={{ width: 96, height: 28, backgroundColor: '#CED0D4', borderRadius: 9999, marginTop: 8 }} />
      </View>
    </View>
  );
}
