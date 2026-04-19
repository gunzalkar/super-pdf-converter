import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ImageCard from './ImageCard';
import { colors, fonts, spacing } from '../styles/theme';

export default function ImageGrid({ images, setImages }) {
  const handleRemove = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragEnd = ({ data }) => {
    setImages(data);
  };

  if (images.length === 0) return null;

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          SELECTED IMAGES{' '}
          <Text style={styles.headerCount}>({images.length})</Text>
        </Text>
        <Text style={styles.headerHint}>Long-press to reorder</Text>
      </View>

      {/* List */}
      <GestureHandlerRootView>
        <DraggableFlatList
          data={images}
          keyExtractor={(item, index) => `${item.uri}-${index}`}
          onDragEnd={handleDragEnd}
          renderItem={({ item, getIndex, drag, isActive }) => (
            <View
              style={[
                styles.draggableItem,
                isActive && styles.draggableItemActive,
              ]}
            >
              <ImageCard
                item={item}
                index={getIndex ? (getIndex() ?? 0) : 0}
                onRemove={handleRemove}
                onDrag={drag}
              />
            </View>
          )}
          scrollEnabled={false}
        />
      </GestureHandlerRootView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  headerTitle: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  headerCount: {
    color: colors.accent,
  },
  headerHint: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.textMuted,
  },
  draggableItem: {
    opacity: 1,
  },
  draggableItemActive: {
    opacity: 0.85,
    transform: [{ scale: 1.02 }],
  },
});
