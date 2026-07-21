import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { parseISODate } from '../lib/workingDays';
import Icon from './Icon';
import { colors, radius, spacing } from '../lib/theme';

interface CalendarProps {
  value: string;
  onChange: (date: string) => void;
}

const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTH_LABELS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function toISODate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/** Builds a 7-wide calendar grid for the given month, padding with nulls. */
function getMonthGrid(year: number, month: number): (number | null)[][] {
  const startWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(startWeekday).fill(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);

  const rows: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}

/** A self-contained month grid — no trigger button, no modal wrapper. */
export default function Calendar({ value, onChange }: CalendarProps) {
  const parsedValue = value ? parseISODate(value) : null;
  const today = new Date();
  const [viewYear, setViewYear] = useState((parsedValue ?? today).getFullYear());
  const [viewMonth, setViewMonth] = useState((parsedValue ?? today).getMonth());

  function goPrevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }

  function goNextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }

  const grid = getMonthGrid(viewYear, viewMonth);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.navButton} onPress={goPrevMonth} accessibilityLabel="Previous month">
          <Icon name="chevron-left" size={20} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {MONTH_LABELS[viewMonth]} {viewYear}
        </Text>
        <TouchableOpacity style={styles.navButton} onPress={goNextMonth} accessibilityLabel="Next month">
          <Icon name="chevron-right" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.weekdayRow}>
        {WEEKDAY_LABELS.map((label) => (
          <Text key={label} style={styles.weekdayLabel}>
            {label}
          </Text>
        ))}
      </View>

      {grid.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.weekRow}>
          {row.map((day, dayIndex) => {
            const isSelected =
              !!parsedValue &&
              parsedValue.getFullYear() === viewYear &&
              parsedValue.getMonth() === viewMonth &&
              parsedValue.getDate() === day;
            const isToday =
              today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day;
            return (
              <TouchableOpacity
                key={dayIndex}
                style={[styles.dayCell, isSelected && styles.dayCellSelected]}
                disabled={day === null}
                onPress={() => day !== null && onChange(toISODate(viewYear, viewMonth, day))}
              >
                {day !== null && (
                  <Text style={[styles.dayText, isToday && styles.dayTextToday, isSelected && styles.dayTextSelected]}>
                    {day}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

// Cells are square (aspectRatio 1) and flex to share the row width — capped
// at 44px so the grid can't blow up into giant tiles if its container ends
// up wider than a compact calendar needs (e.g. an uncapped modal on a wide
// desktop window).
const CELL_MAX_SIZE = 44;

const styles = StyleSheet.create({
  container: { width: '100%', maxWidth: CELL_MAX_SIZE * 7, alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  navButton: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  weekdayRow: { flexDirection: 'row' },
  weekdayLabel: { flex: 1, maxWidth: CELL_MAX_SIZE, textAlign: 'center', fontSize: 12, color: colors.textTertiary, fontWeight: '600' },
  weekRow: { flexDirection: 'row' },
  dayCell: { flex: 1, maxWidth: CELL_MAX_SIZE, maxHeight: CELL_MAX_SIZE, aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  dayCellSelected: { backgroundColor: colors.primary, borderRadius: radius.sm },
  dayText: { fontSize: 14, color: colors.textPrimary },
  dayTextToday: { fontWeight: '700', color: colors.primary },
  dayTextSelected: { color: colors.textOnPrimary, fontWeight: '700' },
});
