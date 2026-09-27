import React from 'react';
import { Tabs } from 'expo-router';
import { AppTabBar, TabBarItem } from '@/src/components/AppTabBar';
import type { AppTabBarProps } from '@/src/components/AppTabBar';

const TAB_META: Record<string, TabBarItem> = {
  index: { key: 'index', label: 'Home', icon: 'home' },
  units: { key: 'units', label: 'Units', icon: 'units' },
  bills: { key: 'bills', label: 'Bills', icon: 'bill' },
  repairs: { key: 'repairs', label: 'Repairs', icon: 'wrench' },
  more: { key: 'more', label: 'More', icon: 'more' },
};

function StaffTabBar({ state, navigation, descriptors }: AppTabBarProps) {
  const activeRoute = state.routes[state.index];
  // A focused nested screen (unit detail, move-in, record payment…) sets this
  // via useHideTabBar() to go full-screen, matching the mockups.
  const hidden = (descriptors[activeRoute.key]?.options as any)?.tabBarStyle?.display === 'none';
  if (hidden) return null;

  const items = state.routes.map((r) => TAB_META[r.name] ?? { key: r.name, label: r.name, icon: 'more' as const });
  return <AppTabBar items={items} activeKey={activeRoute.name} onPress={(key) => navigation.navigate(key)} />;
}

export default function StaffLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <StaffTabBar {...props} />}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="units" />
      <Tabs.Screen name="bills" />
      <Tabs.Screen name="repairs" />
      <Tabs.Screen name="more" />
    </Tabs>
  );
}
