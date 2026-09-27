import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '@/src/constants/theme';
import { Icon } from './Icon';
import { IconName } from '@/src/constants/icons';

export type TabBarItem = {
  key: string;
  label: string;
  icon: IconName;
};

type Props = {
  items: TabBarItem[];
  activeKey: string;
  onPress: (key: string) => void;
};

/** The bits of expo-router's `Tabs` `tabBar` render-prop shape a custom tab
 * bar needs — kept local instead of importing an unexported internal type. */
export type AppTabBarProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  navigation: { navigate: (name: string) => void };
  descriptors: Record<string, { options: Record<string, any> }>;
};

/** `.tabbar` — bottom navigation shared by the staff and tenant tab groups. */
export function AppTabBar({ items, activeKey, onPress }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { height: 56 + insets.bottom, paddingBottom: insets.bottom }]}>
      {items.map((item) => {
        const on = item.key === activeKey;
        return (
          <Pressable
            key={item.key}
            onPress={() => onPress(item.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            style={styles.tab}
          >
            <Icon name={item.icon} size={24} color={on ? colors.teal : colors.muted} />
            <Text style={[styles.label, on && styles.labelOn]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
  label: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.muted },
  labelOn: { fontFamily: fonts.sansBold, color: colors.teal },
});
