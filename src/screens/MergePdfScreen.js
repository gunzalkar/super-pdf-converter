import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { colors, fonts, spacing, radius } from '../styles/theme';
import { mergePdfs, sharePdf } from '../utils/pdfEditor';
import ConvertButton from '../components/ConvertButton';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function MergePdfScreen({ navigation }) {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastPdfUri, setLastPdfUri] = useState(null);

  const pickPdfs = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        multiple: true,
      });

      if (!result.canceled && result.assets) {
        setPdfs((prev) => [...prev, ...result.assets]);
        setLastPdfUri(null);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const clearPdfs = () => {
    setPdfs([]);
    setLastPdfUri(null);
  };

  const handleMerge = async () => {
    if (pdfs.length < 2) {
      Alert.alert('Error', 'Please select at least 2 PDFs to merge.');
      return;
    }
    setLoading(true);
    try {
      const uris = pdfs.map((p) => p.uri);
      const outputUri = await mergePdfs(uris);
      setLastPdfUri(outputUri);
      Alert.alert('Success', 'PDFs merged successfully!', [
        { text: 'Share/Save', onPress: () => sharePdf(outputUri) },
        { text: 'OK', style: 'cancel' }
      ]);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item, getIndex, drag, isActive }) => {
    const idx = getIndex ? (getIndex() ?? 0) : 0;
    return (
      <View style={[styles.card, isActive && styles.cardActive]}>
        <TouchableOpacity style={styles.dragHandle} onLongPress={drag}>
          <Text style={styles.dragIcon}>⠿</Text>
        </TouchableOpacity>
        <View style={styles.info}>
          <Text style={styles.indexBadge}>#{idx + 1}</Text>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        </View>
        <TouchableOpacity style={styles.removeBtn} onPress={() => {
          setPdfs((prev) => prev.filter((_, i) => i !== idx));
        }}>
          <Text style={styles.removeIcon}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── HEADER ── */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>{'< BACK'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MERGE PDF</Text>
        <View style={styles.spacer} />
      </View>

      <Text style={styles.subtitle}>Select multiple PDFs and order them as you want.</Text>

      {/* ── PICKER ── */}
      <TouchableOpacity style={styles.pickerBox} onPress={pickPdfs}>
        <Text style={styles.pickerIcon}>📑</Text>
        <Text style={styles.pickerText}>Browse PDF Files</Text>
      </TouchableOpacity>

      {pdfs.length > 0 && (
        <View style={styles.listContainer}>
          <View style={styles.listHeader}>
            <Text style={styles.listCount}>SELECTED: {pdfs.length}</Text>
            <TouchableOpacity onPress={clearPdfs}>
              <Text style={styles.clearText}>Clear All</Text>
            </TouchableOpacity>
          </View>

          <GestureHandlerRootView style={{ flex: 1 }}>
            <DraggableFlatList
              data={pdfs}
              keyExtractor={(item, index) => item.uri + index}
              onDragEnd={({ data }) => setPdfs(data)}
              renderItem={renderItem}
            />
          </GestureHandlerRootView>
        </View>
      )}

      {/* ── FOOTER ── */}
      <View style={styles.footer}>
        {lastPdfUri && (
          <TouchableOpacity style={styles.shareBtn} onPress={() => sharePdf(lastPdfUri)}>
            <Text style={styles.shareText}>↗ Share Last Merged PDF</Text>
          </TouchableOpacity>
        )}
        <ConvertButton
          onPress={handleMerge}
          loading={loading}
          disabled={pdfs.length < 2}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, marginTop: spacing.md, marginBottom: spacing.xs },
  backBtn: { padding: spacing.xs, borderWidth: 1, borderColor: colors.borderDash, borderRadius: radius.sm },
  backBtnText: { fontFamily: fonts.mono, color: colors.textSecondary, fontSize: 12 },
  headerTitle: { fontFamily: fonts.mono, fontSize: 20, color: colors.accent, fontWeight: 'bold' },
  spacer: { width: 50 },
  subtitle: { fontFamily: fonts.mono, fontSize: 12, color: colors.textSecondary, textAlign: 'center', marginHorizontal: spacing.xl, marginBottom: spacing.lg },
  
  pickerBox: {
    marginHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderDash,
    borderStyle: 'dashed',
    borderRadius: radius.md,
    padding: spacing.xl,
    alignItems: 'center',
    backgroundColor: colors.bgInput,
    marginBottom: spacing.md,
  },
  pickerIcon: { fontSize: 32, marginBottom: spacing.sm },
  pickerText: { fontFamily: fonts.mono, color: colors.textPrimary, fontSize: 14 },
  
  listContainer: { flex: 1, marginHorizontal: spacing.md },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm, paddingHorizontal: spacing.xs },
  listCount: { fontFamily: fonts.mono, fontSize: 12, color: colors.accentMuted },
  clearText: { fontFamily: fonts.mono, fontSize: 12, color: colors.error },
  
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.borderCard, borderRadius: radius.md, padding: spacing.sm, marginBottom: spacing.sm },
  cardActive: { opacity: 0.8, transform: [{ scale: 1.02 }] },
  dragHandle: { paddingRight: spacing.sm },
  dragIcon: { fontSize: 20, color: colors.textMuted },
  info: { flex: 1 },
  indexBadge: { fontFamily: fonts.mono, fontSize: 10, color: colors.accentMuted },
  name: { fontFamily: fonts.mono, fontSize: 12, color: colors.textPrimary },
  removeBtn: { width: 28, height: 28, borderWidth: 1, borderColor: colors.error, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  removeIcon: { fontSize: 10, color: colors.error, fontWeight: 'bold' },
  
  footer: { padding: spacing.lg },
  shareBtn: { padding: spacing.md, borderWidth: 1, borderColor: colors.accent, borderRadius: radius.sm, alignItems: 'center', marginBottom: spacing.md },
  shareText: { fontFamily: fonts.mono, fontSize: 12, color: colors.accent },
});
