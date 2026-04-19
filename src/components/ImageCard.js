import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fonts, spacing, radius } from '../styles/theme';

export default function ImageCard({ item, index, onRemove }) {
  return (
    <View style={styles.card}>
      {/* Drag handle */}
      <View style={styles.dragHandle}>
        <Text style={styles.dragIcon}>⠿</Text>
      </View>

      {/* Thumbnail */}
      <View style={styles.thumbContainer}>
        <Image
          source={{ uri: item.uri }}
          style={styles.thumb}
          resizeMode="cover"
        />
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.indexBadge}>#{index + 1}</Text>
        <Text style={styles.name} numberOfLines={1}>
          {item.name || item.fileName || `image_${index + 1}`}
        </Text>
        {item.fileSize && (
          <Text style={styles.size}>
            {(item.fileSize / 1024).toFixed(0)} KB
          </Text>
        )}
      </View>

      {/* Remove button */}
      <TouchableOpacity style={styles.removeBtn} onPress={() => onRemove(index)}>
        <Text style={styles.removeIcon}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.borderCard,
    borderRadius: radius.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  dragHandle: {
    paddingHorizontal: spacing.xs,
  },
  dragIcon: {
    fontSize: 20,
    color: colors.accentMuted,
  },
  thumbContainer: {
    width: 56,
    height: 56,
    borderRadius: radius.sm,
    overflow: 'hidden',
    backgroundColor: colors.bgInput,
    borderWidth: 1,
    borderColor: colors.borderDash,
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  indexBadge: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.accentMuted,
    letterSpacing: 0.5,
  },
  name: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.textPrimary,
  },
  size: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.textSecondary,
  },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeIcon: {
    fontSize: 10,
    color: colors.error,
    fontWeight: 'bold',
  },
});
