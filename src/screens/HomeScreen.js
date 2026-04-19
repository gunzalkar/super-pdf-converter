import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from 'react-native';
import { colors, fonts, spacing, radius } from '../styles/theme';

const TOOLS = [
  {
    category: 'ORGANIZE',
    items: [
      { id: 'merge', title: 'Merge PDF', desc: 'Combine multiple PDFs into one', icon: '◫', route: 'MergePdf' },
      { id: 'split', title: 'Split PDF', desc: 'Divide a PDF into separate files', icon: '◰', route: 'SplitPdf' },
      { id: 'rotate', title: 'Rotate PDF', desc: 'Rotate pages in a PDF document', icon: '↻', soon: true },
    ],
  },
  {
    category: 'CONVERT TO PDF',
    items: [
      { id: 'img-to-pdf', title: 'Image to PDF', desc: 'Convert JPG, PNG to PDF', icon: '🖼️', route: 'ImageToPdf' },
      { id: 'word-to-pdf', title: 'Word to PDF', desc: 'Convert DOCX to PDF', icon: 'W', soon: true },
      { id: 'excel-to-pdf', title: 'Excel to PDF', desc: 'Convert XLSX to PDF', icon: 'X', soon: true },
    ],
  },
  {
    category: 'SECURITY',
    items: [
      { id: 'protect', title: 'Protect PDF', desc: 'Add password encryption', icon: '🔒', soon: true },
      { id: 'unlock', title: 'Unlock PDF', desc: 'Remove password protection', icon: '🔓', soon: true },
    ],
  },
  {
    category: 'AI TOOLS',
    items: [
      { id: 'chat', title: 'Chat with PDF', desc: 'Summarize and analyze documents', icon: '🤖', soon: true },
    ],
  },
];

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.logoTag}>S/PDF</Text>
          <View>
            <Text style={styles.headerTitle}>SUPER PDF</Text>
            <Text style={styles.headerSubtitle}>CONVERTER</Text>
          </View>
        </View>

        {/* SEARCH BAR */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Tools..."
            placeholderTextColor={colors.textMuted}
          />
        </View>

        {/* TOOL GRID */}
        {TOOLS.map((section) => (
          <View key={section.category} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.category}</Text>
            <View style={styles.grid}>
              {section.items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.card}
                  onPress={() => item.route ? navigation.navigate(item.route) : null}
                  disabled={item.soon}
                >
                  <View style={styles.iconContainer}>
                    <Text style={styles.cardIcon}>{item.icon}</Text>
                  </View>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  {item.desc ? (
                    <Text style={styles.cardDesc} numberOfLines={2}>{item.desc}</Text>
                  ) : null}
                  {item.soon && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>SOON</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
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
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  logoTag: {
    fontFamily: fonts.mono,
    fontSize: 20,
    color: colors.bg,
    backgroundColor: colors.accent,
    padding: spacing.xs,
    fontWeight: 'bold',
    marginRight: spacing.md,
  },
  headerTitle: {
    fontFamily: fonts.mono,
    fontSize: 22,
    color: colors.textPrimary,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontFamily: fonts.mono,
    fontSize: 16,
    color: colors.accent,
    letterSpacing: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgInput,
    marginHorizontal: spacing.md,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderDash,
  },
  searchIcon: {
    fontSize: 14,
    color: colors.textMuted,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 48,
    color: colors.textPrimary,
    fontFamily: fonts.mono,
    fontSize: 14,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textSecondary,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    letterSpacing: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.sm,
  },
  card: {
    width: '46%',
    margin: '2%',
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderCard,
    position: 'relative',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(232, 124, 62, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(232, 124, 62, 0.3)',
  },
  cardIcon: {
    fontSize: 18,
    color: colors.accent,
  },
  cardTitle: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  cardDesc: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.textSecondary,
    lineHeight: 14,
  },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.bgInput,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.borderDash,
  },
  badgeText: {
    fontFamily: fonts.mono,
    fontSize: 8,
    color: colors.textMuted,
  },
});
