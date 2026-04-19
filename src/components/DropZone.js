import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { colors, fonts, spacing, radius } from '../styles/theme';

const SUPPORTED_MIME = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/bmp',
  'image/webp',
  'image/gif',
  'image/tiff',
  'image/heic',
  'image/heif',
  'image/svg+xml',
  'image/ico',
  'image/x-icon',
];

export default function DropZone({ onImagesSelected }) {
  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access photos is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
      exif: false,
    });

    if (!result.canceled && result.assets?.length > 0) {
      onImagesSelected(result.assets);
    }
  };

  const pickFromFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: SUPPORTED_MIME,
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const mapped = result.assets.map((a) => ({
          uri: a.uri,
          name: a.name,
          mimeType: a.mimeType,
          width: null,
          height: null,
        }));
        onImagesSelected(mapped);
      }
    } catch (e) {
      console.warn('Document pick error:', e);
    }
  };

  return (
    <View style={styles.container}>
      {/* Icon */}
      <Text style={styles.icon}>🖼️</Text>

      {/* Main text */}
      <Text style={styles.title}>Tap to browse images</Text>
      <Text style={styles.subtitle}>
        Supports PNG · JPG · JPEG · BMP · WEBP · GIF · TIFF · HEIC · SVG · ICO
      </Text>
      <Text style={styles.hint}>Multiple images allowed • Tap to reorder • No size limit</Text>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.btnPrimary} onPress={pickFromGallery} activeOpacity={0.7}>
          <Text style={styles.btnPrimaryText}>Browse Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSecondary} onPress={pickFromFiles} activeOpacity={0.7}>
          <Text style={styles.btnSecondaryText}>Browse Files</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.borderDash,
    borderStyle: 'dashed',
    borderRadius: radius.lg,
    backgroundColor: colors.bgCard,
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  icon: {
    fontSize: 52,
    marginBottom: spacing.md,
  },
  title: {
    fontFamily: fonts.mono,
    fontSize: 18,
    color: colors.accent,
    textAlign: 'center',
    marginBottom: spacing.sm,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xs,
    lineHeight: 18,
  },
  hint: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  btnPrimary: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: 'transparent',
  },
  btnPrimaryText: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.accent,
    letterSpacing: 0.5,
  },
  btnSecondary: {
    borderWidth: 1,
    borderColor: colors.borderCard,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: 'transparent',
  },
  btnSecondaryText: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
});
