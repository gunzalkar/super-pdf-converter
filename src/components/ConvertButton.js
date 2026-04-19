import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import { colors, fonts, spacing, radius } from '../styles/theme';

export default function ConvertButton({ onPress, loading, disabled, title }) {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={[styles.btn, (disabled || loading) && styles.btnDisabled]}
        onPress={onPress}
        activeOpacity={0.8}
        disabled={disabled || loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.btnText} size="small" />
        ) : (
          <Text style={styles.icon}>⬛</Text>
        )}
        <Text style={[styles.label, (disabled || loading) && styles.labelDisabled]}>
          {loading ? 'PROCESSING...' : (title || 'CONVERT TO PDF')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xxl,
  },
  btn: {
    backgroundColor: colors.btnBg,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.accentMuted,
  },
  btnDisabled: {
    opacity: 0.4,
  },
  icon: {
    fontSize: 14,
    color: colors.btnText,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 16,
    color: colors.btnText,
    letterSpacing: 3,
    fontWeight: '700',
  },
  labelDisabled: {
    color: colors.textSecondary,
  },
});
