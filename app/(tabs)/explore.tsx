import { BorderRadius, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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
  const { theme, colors } = useTheme();
  const router = useRouter(); 

  const myStuffItems = [
    { 
        icon: 'bookmark' as const, 
        label: 'Bookmarks', 
        desc: 'Saved items', 
        color: '#4A6CF7', 
        bg: '#EEF2FF', 
        route: '/my-stuff/bookmarks' 
    },
    { 
        icon: 'document-text' as const, 
        label: 'Notes', 
        desc: 'Your study notes', 
        color: '#22C55E', 
        bg: '#F0FDF4',
        route: '/my-stuff/notes'
    },
    { 
        icon: 'trophy' as const, 
        label: 'Quiz Results', 
        desc: 'Your scores', 
        color: '#F59E0B', 
        bg: '#FFF7ED',
        route: '/my-stuff/quizzes'
    },
    { 
        icon: 'stats-chart' as const, 
        label: 'Progress', 
        desc: 'Track progress', 
        color: '#EC4899', 
        bg: '#FDF2F8',
        route: '/my-stuff/progress'
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.pageTitle, { color: colors.text }]}>My Stuff</Text>
        <Text style={[styles.pageSubtitle, { color: colors.textSecondary }]}>
          Quick access to your learning materials
        </Text>

        <View style={styles.grid}>
          {myStuffItems.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.gridItem, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }]}
              activeOpacity={0.7}
              onPress={() => router.push(item.route as any)}
            >
              <View style={[styles.gridIconBg, { backgroundColor: item.bg }]}>
                <Ionicons name={item.icon} size={26} color={item.color} />
              </View>
              <Text style={[styles.gridLabel, { color: colors.text }]}>{item.label}</Text>
              <Text style={[styles.gridDesc, { color: colors.textSecondary }]}>{item.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity placeholder */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
        <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
          <Ionicons name="time-outline" size={40} color={colors.textTertiary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
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
