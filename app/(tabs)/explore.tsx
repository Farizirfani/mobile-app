import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ExploreScreen() {
  const { user } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const myStuffItems = [
    { icon: 'bookmark' as const, label: 'Bookmarks', desc: 'Saved items', color: '#4A6CF7', bg: '#EEF2FF' },
    { icon: 'document-text' as const, label: 'Notes', desc: 'Your study notes', color: '#22C55E', bg: '#F0FDF4' },
    { icon: 'trophy' as const, label: 'Quiz Results', desc: 'Your scores', color: '#F59E0B', bg: '#FFF7ED' },
    { icon: 'stats-chart' as const, label: 'Progress', desc: 'Track progress', color: '#EC4899', bg: '#FDF2F8' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.pageTitle, { color: theme.text }]}>My Stuff</Text>
        <Text style={[styles.pageSubtitle, { color: theme.textSecondary }]}>
          Quick access to your learning materials
        </Text>

        <View style={styles.grid}>
          {myStuffItems.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.gridItem, { backgroundColor: theme.surface, shadowColor: theme.cardShadow }]}
              activeOpacity={0.7}
            >
              <View style={[styles.gridIconBg, { backgroundColor: item.bg }]}>
                <Ionicons name={item.icon} size={26} color={item.color} />
              </View>
              <Text style={[styles.gridLabel, { color: theme.text }]}>{item.label}</Text>
              <Text style={[styles.gridDesc, { color: theme.textSecondary }]}>{item.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity placeholder */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Activity</Text>
        <View style={[styles.emptyState, { backgroundColor: theme.surface }]}>
          <Ionicons name="time-outline" size={40} color={theme.textTertiary} />
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            Your recent activity will appear here
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.md },
  pageTitle: { fontSize: 26, fontWeight: '800', marginBottom: 4 },
  pageSubtitle: { fontSize: 14, marginBottom: Spacing.xxl },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  gridItem: {
    width: '47%',
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  gridIconBg: {
    width: 52, height: 52, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: Spacing.md,
  },
  gridLabel: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  gridDesc: { fontSize: 13 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: Spacing.md },
  emptyState: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xxxl,
    alignItems: 'center',
    gap: Spacing.md,
  },
  emptyText: { fontSize: 14, textAlign: 'center' },
});
