import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colors, fonts, spacing, radius } from '../styles/theme';

const PAGE_SIZES = [
  { label: 'A4 (210 × 297 mm)', value: 'A4' },
  { label: 'A3 (297 × 420 mm)', value: 'A3' },
  { label: 'A5 (148 × 210 mm)', value: 'A5' },
  { label: 'Letter (215.9 × 279.4 mm)', value: 'LETTER' },
  { label: 'Legal (215.9 × 355.6 mm)', value: 'LEGAL' },
  { label: 'Tabloid (279.4 × 431.8 mm)', value: 'TABLOID' },
];

const ORIENTATIONS = [
  { label: 'Portrait', value: 'portrait' },
  { label: 'Landscape', value: 'landscape' },
];

const QUALITIES = [
  { label: 'Low (50%)', value: 0.5 },
  { label: 'Medium (75%)', value: 0.75 },
  { label: 'High (85%)', value: 0.85 },
  { label: 'Max (100%)', value: 1.0 },
];

function ControlCard({ label, children }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>{label}</Text>
      {children}
    </View>
  );
}

export default function ControlPanel({ settings, setSettings }) {
  const set = (key) => (val) => setSettings((prev) => ({ ...prev, [key]: val }));

  return (
    <View style={styles.wrapper}>
      <View style={styles.grid}>
        {/* Page Size */}
        <ControlCard label="Page Size">
          <View style={styles.pickerWrap}>
            <Picker
              selectedValue={settings.pageSize}
              onValueChange={set('pageSize')}
              style={styles.picker}
              dropdownIconColor={colors.accent}
              itemStyle={styles.pickerItem}
            >
              {PAGE_SIZES.map((s) => (
                <Picker.Item key={s.value} label={s.label} value={s.value} />
              ))}
            </Picker>
          </View>
        </ControlCard>

        {/* Orientation */}
        <ControlCard label="Orientation">
          <View style={styles.pickerWrap}>
            <Picker
              selectedValue={settings.orientation}
              onValueChange={set('orientation')}
              style={styles.picker}
              dropdownIconColor={colors.accent}
            >
              {ORIENTATIONS.map((o) => (
                <Picker.Item key={o.value} label={o.label} value={o.value} />
              ))}
            </Picker>
          </View>
        </ControlCard>

        {/* Margin */}
        <ControlCard label="Margin (px)">
          <TextInput
            style={styles.input}
            value={String(settings.margin)}
            onChangeText={(v) => {
              const n = parseInt(v, 10);
              if (!isNaN(n) && n >= 0) set('margin')(n);
              else if (v === '') set('margin')(0);
            }}
            keyboardType="numeric"
            placeholderTextColor={colors.textMuted}
            selectionColor={colors.accent}
          />
        </ControlCard>

        {/* Image Quality */}
        <ControlCard label="Image Quality">
          <View style={styles.pickerWrap}>
            <Picker
              selectedValue={settings.quality}
              onValueChange={set('quality')}
              style={styles.picker}
              dropdownIconColor={colors.accent}
            >
              {QUALITIES.map((q) => (
                <Picker.Item key={q.value} label={q.label} value={q.value} />
              ))}
            </Picker>
          </View>
        </ControlCard>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  card: {
    backgroundColor: colors.bgControlCard,
    borderWidth: 1,
    borderColor: colors.borderCard,
    borderRadius: radius.md,
    padding: spacing.sm,
    width: '47.5%',
    minWidth: 150,
  },
  cardLabel: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.accent,
    marginBottom: spacing.xs,
    letterSpacing: 0.5,
  },
  pickerWrap: {
    backgroundColor: colors.bgInput,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borderInput,
    overflow: 'hidden',
  },
  picker: {
    color: colors.textPrimary,
    backgroundColor: colors.bgInput,
    fontFamily: fonts.mono,
    height: 44,
  },
  pickerItem: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.textPrimary,
  },
  input: {
    backgroundColor: colors.bgInput,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borderInput,
    color: colors.textPrimary,
    fontFamily: fonts.mono,
    fontSize: 15,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    height: 44,
  },
});
