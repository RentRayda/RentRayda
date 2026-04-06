import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Tabs } from 'expo-router';
import { USE_MOCK_DATA, MOCK_CONNECTION_REQUESTS } from '../../lib/mock-data';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

// TODO: derive from auth session
const USER_ROLE: 'landlord' | 'tenant' = 'tenant';

function TabIcon({ icon, label, focused }: { icon: string; label: string; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 4 }}>
      {focused && (
        <View style={{
          position: 'absolute', top: -4, width: 48, height: 2,
          backgroundColor: '#2563EB',
        }} />
      )}
      <Text style={{ fontSize: 14, fontFamily: 'AlteHaasGroteskBold', marginTop: 2, color: focused ? '#2563EB' : '#8A8D91' }}>{icon}</Text>
      <Text style={{
        fontSize: 10, marginTop: 2,
        color: focused ? '#2563EB' : '#8A8D91',
        fontFamily: focused ? 'AlteHaasGroteskBold' : 'AlteHaasGrotesk',
      }}>
        {label}
      </Text>
    </View>
  );
}

function InboxBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <View style={{
      position: 'absolute', top: -2, right: -2,
      width: 16, height: 16, borderRadius: 8,
      backgroundColor: '#E41E3F', alignItems: 'center', justifyContent: 'center',
    }}>
      <Text style={{ fontSize: 8, color: '#FFFFFF', fontFamily: 'AlteHaasGroteskBold' }}>{count > 9 ? '9+' : count}</Text>
    </View>
  );
}

export default function TabsLayout() {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (USE_MOCK_DATA) {
      const pending = MOCK_CONNECTION_REQUESTS.filter(r => r.status === 'pending');
      setPendingCount(pending.length);
      return;
    }
    // Fetch pending request count for inbox badge
    const fetchCount = async () => {
      try {
        const res = await fetch(`${API_URL}/api/connections/requests`, { credentials: 'include' });
        if (res.ok) {
          const { data } = await res.json();
          const pending = data.filter((r: { status: string }) => r.status === 'pending');
          setPendingCount(pending.length);
        }
      } catch { /* silent */ }
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 48,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#CED0D4',
        },
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      {/* Tab 1: Search (tenant) or Listings (landlord) */}
      {USER_ROLE === 'tenant' ? (
        <Tabs.Screen
          name="search"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon icon="S" label="Search" focused={focused} />
            ),
          }}
        />
      ) : (
        <Tabs.Screen
          name="listings"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon icon="H" label="My Listings" focused={focused} />
            ),
          }}
        />
      )}

      {/* Tab 2: Inbox */}
      <Tabs.Screen
        name="inbox"
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <TabIcon icon="I" label="Inbox" focused={focused} />
              <InboxBadge count={pendingCount} />
            </View>
          ),
        }}
      />

      {/* Tab 3: Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="P" label="Profile" focused={focused} />
          ),
        }}
      />

      {/* Hide tabs that shouldn't show for current role */}
      {USER_ROLE === 'tenant' ? (
        <Tabs.Screen name="listings" options={{ href: null }} />
      ) : (
        <Tabs.Screen name="search" options={{ href: null }} />
      )}
    </Tabs>
  );
}
