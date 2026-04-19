import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  TouchableOpacity,
} from 'react-native';
import DropZone from '../components/DropZone';
import ImageGrid from '../components/ImageGrid';
import ControlPanel from '../components/ControlPanel';
import ConvertButton from '../components/ConvertButton';
import { generatePdf, sharePdf } from '../utils/pdfGenerator';
import { colors, fonts, spacing, radius } from '../styles/theme';



const TAGS = ['On-Device', 'Multi-Image', 'Drag & Reorder', 'All Formats'];

const DEFAULT_SETTINGS = {
  pageSize: 'A4',
  orientation: 'portrait',
  margin: 20,
  quality: 0.85,
};

export default function ImageToPdfScreen({ navigation }) {
  const [images, setImages] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);
  const [lastPdfUri, setLastPdfUri] = useState(null);

  const handleImagesSelected = (newImages) => {
    setImages((prev) => {
      const existingUris = new Set(prev.map((i) => i.uri));
      const filtered = newImages.filter((i) => !existingUris.has(i.uri));
      return [...prev, ...filtered];
    });
    setLastPdfUri(null);
  };

  const handleClearAll = () => {
    Alert.alert('Clear All', 'Remove all selected images?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => { setImages([]); setLastPdfUri(null); } },
    ]);
  };

  const handleConvert = async () => {
    if (images.length === 0) {
      Alert.alert('No Images', 'Please select at least one image first.');
      return;
    }
    setLoading(true);
    try {
      const uri = await generatePdf(images, settings);
      setLastPdfUri(uri);
      Alert.alert(
        '✅ PDF Created!',
        `Your PDF has been generated with ${images.length} page(s).`,
        [
          { text: 'Share / Save', onPress: () => sharePdf(uri) },
          { text: 'OK', style: 'cancel' },
        ]
      );
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to generate PDF. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!lastPdfUri) return;
    try {
      await sharePdf(lastPdfUri);
    } catch (err) {
      Alert.alert('Share failed', err.message);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── HEADER ── */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>{'< BACK'}</Text>
          </TouchableOpacity>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>IMG_to_PDF</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        <Text style={styles.headerSubtitle}>
          Convert multiple images to a single PDF document.{'\n'}
          Runs entirely on-device — no uploads to any server.
        </Text>

        {/* Tag pills */}
        <View style={styles.tagRow}>
          {TAGS.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* ── DROP ZONE ── */}
        <DropZone onImagesSelected={handleImagesSelected} />

        {/* ── IMAGE LIST ── */}
        {images.length > 0 && (
          <>
            <ImageGrid images={images} setImages={setImages} />
            <TouchableOpacity style={styles.clearBtn} onPress={handleClearAll}>
              <Text style={styles.clearBtnText}>✕ Clear All</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ── CONTROLS ── */}
        <ControlPanel settings={settings} setSettings={setSettings} />

        {/* ── SHARE LAST PDF (if exists) ── */}
        {lastPdfUri && (
          <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
            <Text style={styles.shareBtnText}>↗ Share Last PDF</Text>
          </TouchableOpacity>
        )}

        {/* ── CONVERT BUTTON ── */}
        <ConvertButton
          onPress={handleConvert}
          loading={loading}
          disabled={images.length === 0}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    paddingTop: spacing.lg,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  backBtn: {
    padding: spacing.xs,
    borderWidth: 1,
    borderColor: colors.borderDash,
    borderRadius: radius.sm,
  },
  backBtnText: {
    fontFamily: fonts.mono,
    color: colors.textSecondary,
    fontSize: 12,
  },
  headerSpacer: {
    width: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
  },
  headerTitle: {
    fontFamily: fonts.mono,
    fontSize: 28,
    color: colors.accent,
    letterSpacing: 2,
    fontWeight: '700',
  },
  headerVersion: {
    fontFamily: fonts.mono,
    fontSize: 18,
    color: colors.accent,
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xl,
  },

  // Tags
  tagRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  tag: {
    borderWidth: 1,
    borderColor: colors.tagBorder,
    borderRadius: radius.sm,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    backgroundColor: 'transparent',
  },
  tagText: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.tagText,
    letterSpacing: 0.5,
  },

  // Clear all
  clearBtn: {
    alignSelf: 'flex-end',
    marginRight: spacing.md,
    marginTop: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  clearBtnText: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.error,
    letterSpacing: 0.5,
  },

  // Share
  shareBtn: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radius.sm,
    alignSelf: 'center',
  },
  shareBtnText: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.accent,
  },
});
