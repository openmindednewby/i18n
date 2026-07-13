/**
 * `LanguageSwitcher` — a compact segmented control of locale codes (EN · DE · ES · FR · PT), the
 * same shape as the v1 AML console's `#lang-switcher`.
 *
 * Colours come in as PROPS rather than from a theme context on purpose: it keeps this package
 * dependency-free (no peer dep on the UI kit or a design-token package), so any app — themed or
 * not — can drop it in. Themed apps pass their own tokens, e.g.
 * `colors={{ text: colors.textSecondary, activeText: '#fff', activeBackground: colors.primary }}`.
 */
import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View, type PressableStateCallbackType } from 'react-native';

import { useI18n } from './I18nProvider';
import type { LocaleCode } from './types';

const BORDER_RADIUS = 8;
const PADDING_H = 9;
const PADDING_V = 5;
const FONT_SIZE = 12;
const GAP = 2;
/** WCAG 2.5.5: an interactive target must be at least 44×44 px. */
const MIN_TARGET = 44;

export interface LanguageSwitcherColors {
  /** Inactive label colour. */
  text: string;
  /** Active label colour. */
  activeText: string;
  /** Active pill background. */
  activeBackground: string;
  /** Hover/press background for an inactive option. Optional. */
  hoverBackground?: string;
}

export interface LanguageSwitcherProps {
  colors: LanguageSwitcherColors;
  /** Accessible name for the group. Default `Language`. */
  accessibilityLabel?: string;
  testID?: string;
}

/**
 * react-native-web adds `hovered` to the Pressable style-callback state; the core react-native
 * types do not model it. Widen the state rather than casting the whole style callback.
 */
type PressableState = PressableStateCallbackType & { hovered?: boolean };

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: GAP },
  option: {
    paddingHorizontal: PADDING_H,
    paddingVertical: PADDING_V,
    borderRadius: BORDER_RADIUS,
    minWidth: MIN_TARGET,
    minHeight: MIN_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: FONT_SIZE, fontWeight: '600' },
});

export function LanguageSwitcher({
  colors,
  accessibilityLabel = 'Language',
  testID = 'language-switcher',
}: LanguageSwitcherProps): React.ReactElement {
  const { locale, setLocale, locales } = useI18n();

  const select = useCallback((code: LocaleCode) => () => setLocale(code), [setLocale]);

  return (
    <View accessibilityRole="radiogroup" aria-label={accessibilityLabel} style={styles.row} testID={testID}>
      {locales.map((option) => {
        const isActive = option.code === locale;
        return (
          <Pressable
            key={option.code}
            accessibilityHint={`Show the interface in ${option.label}`}
            accessibilityLabel={option.label}
            accessibilityRole="radio"
            accessibilityState={{ selected: isActive }}
            aria-checked={isActive}
            style={({ hovered }: PressableState) => [
              styles.option,
              isActive
                ? { backgroundColor: colors.activeBackground }
                : hovered && colors.hoverBackground
                  ? { backgroundColor: colors.hoverBackground }
                  : null,
            ]}
            testID={`${testID}-${option.code}`}
            onPress={select(option.code)}
          >
            <Text style={[styles.label, { color: isActive ? colors.activeText : colors.text }]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
