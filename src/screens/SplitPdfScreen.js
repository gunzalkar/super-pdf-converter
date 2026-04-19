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
import { splitPdfAllPages, sharePdf } from '../utils/pdfEditor';
import ConvertButton from '../components/ConvertButton';

export default function SplitPdfScreen({ navigation }) {
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [loading, setLoading] = useState(false);
  const [splitFiles, setSplitFiles] = useState([]);

  const pickPdf = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        multiple: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedPdf(result.assets[0]);
        setSplitFiles([]); // reset on new selection
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleSplit = async () => {
    if (!selectedPdf) {
      Alert.alert('Error', 'Please select a PDF first.');
      return;
    }
    setLoading(true);
    try {
      const outputUris = await splitPdfAllPages(selectedPdf.uri);
      setSplitFiles(outputUris);
      Alert.alert('Success', `Split into ${outputUris.length} individual pages!`);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── HEADER ── */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>{'< BACK'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SPLIT PDF</Text>
        <View style={styles.spacer} />
      </View>

      <Text style={styles.subtitle}>Divide your PDF document into separate single-page files.</Text>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* ── PICKER ── */}
        {!selectedPdf ? (
          <TouchableOpacity style={styles.pickerBox} onPress={pickPdf}>
            <Text style={styles.pickerIcon}>📑</Text>
            <Text style={styles.pickerText}>Select a PDF to Split</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.selectedBox}>
            <View style={styles.fileInfo}>
              <Text style={styles.fileIcon}>📄</Text>
              <Text style={styles.fileName} numberOfLines={1}>{selectedPdf.name}</Text>
            </View>
            <TouchableOpacity style={styles.changeBtn} onPress={pickPdf}>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── RESULTS ── */}
        {splitFiles.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>RESULT FILES ({splitFiles.length})</Text>
            {splitFiles.map((uri, index) => (
              <View key={uri} style={styles.resultItem}>
                <Text style={styles.resultName}>Page {index + 1}.pdf</Text>
                <TouchableOpacity style={styles.miniShareBtn} onPress={() => sharePdf(uri)}>
                  <Text style={styles.miniShareText}>Share</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* ── FOOTER ── */}
      <View style={styles.footer}>
        <ConvertButton
          onPress={handleSplit}
          loading={loading}
          disabled={!selectedPdf || splitFiles.length > 0} // disable if already split or none selected
          title={splitFiles.length > 0 ? "ALREADY SPLIT" : "SPLIT ALL PAGES"}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: spacing.xxl },
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
  
  selectedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: colors.bgCard,
    marginBottom: spacing.md,
  },
  fileInfo: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: spacing.md },
  fileIcon: { fontSize: 20, marginRight: spacing.sm },
  fileName: { fontFamily: fonts.mono, fontSize: 14, color: colors.textPrimary, flex: 1 },
  changeBtn: { padding: spacing.xs, borderWidth: 1, borderColor: colors.borderCard, borderRadius: radius.sm },
  changeText: { fontFamily: fonts.mono, fontSize: 10, color: colors.textSecondary },

  resultsContainer: { marginHorizontal: spacing.lg, marginTop: spacing.md },
  resultsTitle: { fontFamily: fonts.mono, fontSize: 12, color: colors.accent, marginBottom: spacing.sm, letterSpacing: 1 },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.bgInput,
    padding: spacing.md,
    borderRadius: radius.sm,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.borderDash,
  },
  resultName: { fontFamily: fonts.mono, fontSize: 12, color: colors.textPrimary },
  miniShareBtn: { backgroundColor: colors.accent, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: radius.sm },
  miniShareText: { fontFamily: fonts.mono, fontSize: 10, color: colors.bg, fontWeight: 'bold' },

  footer: { padding: spacing.lg },
});
