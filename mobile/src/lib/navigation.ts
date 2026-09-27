import { useCallback } from 'react';
import { useFocusEffect, useNavigation } from 'expo-router';

/**
 * Hides the parent tab bar while a pushed detail/action screen (unit detail,
 * move-in, record payment…) is focused, matching the mockups — those screens
 * have no tab bar, only a back link.
 */
// expo-router's default `useNavigation()` generic resolves against the
// (empty, until `expo-router/typed-routes` generates one) RootParamList, so
// its methods type-check as absent here even though they exist at runtime.
// This util walks the live navigator tree generically, so it takes `any`
// deliberately rather than fighting that default type.
type AnyNavigation = {
  getState: () => { type: string } | undefined;
  getParent: () => AnyNavigation | undefined;
  setOptions: (options: Record<string, unknown>) => void;
};

export function useHideTabBar() {
  const navigation = useNavigation() as unknown as AnyNavigation;
  useFocusEffect(
    useCallback(() => {
      // Walk up past any nested stack navigators to the tab navigator itself
      // — a screen two folders deep (units/[id], bills/[id]/pay) needs more
      // than one getParent() hop to reach it.
      let target: AnyNavigation | undefined = navigation;
      for (let i = 0; i < 4 && target; i++) {
        if (target.getState()?.type === 'tab') break;
        target = target.getParent();
      }
      target?.setOptions({ tabBarStyle: { display: 'none' } });
      return () => target?.setOptions({ tabBarStyle: undefined });
    }, [navigation])
  );
}
