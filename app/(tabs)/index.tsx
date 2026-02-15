import { BorderRadius, Colors, Spacing, SubjectColors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { DashboardData, getDashboard } from '@/services/dashboard';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { theme, colors, isDark } = useTheme();

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = async () => {
    try {
      const data = await getDashboard();
      setDashboard(data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
  };

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const examReadiness = dashboard?.examReadiness ?? 0;

  // Mock weekly study hours for chart
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const studyData = [3, 4, 6, 5, 7, 4, 2];
  const maxStudy = Math.max(...studyData);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerCenter}>
            <Text style={[styles.greeting, { color: colors.text }]}>
              Welcome back, {user?.name?.split(' ')[0] || 'Student'}!
            </Text>
            <Text style={[styles.dateText, { color: colors.textSecondary }]}>{dateStr}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={[styles.notifButton, { backgroundColor: colors.surfaceSecondary }]}>
              <Ionicons name="notifications-outline" size={20} color={colors.text} />
            </TouchableOpacity>
            <View style={[styles.avatarCircle, { backgroundColor: Colors.primary }]}>
              <Text style={styles.avatarText}>{user?.name?.[0] || 'S'}</Text>
            </View>
          </View>
        </View>

        {/* Exam Readiness Card */}
        <View style={[styles.card, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }]}>
          <View style={styles.examHeader}>
            <View>
              <Text style={[styles.examTitle, { color: colors.text }]}>Exam Readiness</Text>
              <Text style={[styles.examSubtitle, { color: colors.textSecondary }]}>You're doing great!</Text>
            </View>
            <View style={[styles.examIconBg, { backgroundColor: isDark ? 'rgba(74, 108, 247, 0.15)' : '#EEF2FF' }]}>
              <Ionicons name="school" size={20} color={Colors.primary} />
            </View>
          </View>
          <View style={styles.examRingContainer}>
            <View style={styles.ringOuter}>
              <View style={[styles.ringTrack, { borderColor: colors.progressBg }]} />
              <View style={[styles.ringProgress, {
                borderColor: Colors.primary,
                borderTopColor: 'transparent',
                borderRightColor: examReadiness > 25 ? Colors.primary : 'transparent',
                borderBottomColor: examReadiness > 50 ? Colors.primary : 'transparent',
                borderLeftColor: examReadiness > 75 ? Colors.primary : 'transparent',
                transform: [{ rotate: `${(examReadiness / 100) * 360}deg` }],
              }]} />
              <View style={[styles.ringInner, { backgroundColor: colors.surface }]}>
                <Text style={[styles.ringPercent, { color: Colors.primary }]}>{examReadiness}%</Text>
              </View>
            </View>
          </View>
          <View style={styles.examFooter}>
            <View style={[styles.changeBadge, { backgroundColor: isDark ? 'rgba(34, 197, 94, 0.15)' : '#ECFDF5' }]}>
              <Text style={{ color: '#22C55E', fontSize: 13, fontWeight: '600' }}>+12% from last week</Text>
            </View>
          </View>
        </View>

        {/* Continue Reading */}
        {dashboard?.continueReading && (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }]}
            onPress={() => router.push(`/chapter/${dashboard.continueReading.chapter?._id}`)}
            activeOpacity={0.7}
          >
            <View style={styles.readingHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {dashboard.continueReading.chapter?.title || 'Bab 3: Biologi Sel'}
              </Text>
              <TouchableOpacity>
                <Text style={{ color: Colors.primary, fontWeight: '600', fontSize: 14 }}>Continue Reading →</Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.readingContent, { color: colors.textSecondary }]} numberOfLines={3}>
              {dashboard.continueReading.chapter?.content ||
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}
            </Text>
            <View style={styles.readingMeta}>
              <Text style={{ color: Colors.primary, fontSize: 13, fontWeight: '600' }}>
                Chapter {dashboard.continueReading.chapter?.order || 3}
              </Text>
              <Text style={{ color: colors.textTertiary, fontSize: 13 }}>
                {dashboard.continueReading.chapter?.readingTime || '15 min read'}
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>Progress</Text>
              <View style={styles.progressBarRow}>
                <View style={[styles.progressBarBg, { backgroundColor: colors.progressBg }]}>
                  <View
                    style={[styles.progressBarFill, {
                      width: `${dashboard.continueReading.progress || 45}%`,
                      backgroundColor: Colors.primary,
                    }]}
                  />
                </View>
                <Text style={[styles.progressPercent, { color: colors.textSecondary }]}>
                  {dashboard.continueReading.progress || 45}%
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Continue Learning */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Continue Learning</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/courses')}>
            <Text style={{ color: colors.textTertiary, fontSize: 14 }}>View All</Text>
          </TouchableOpacity>
        </View>
        {(dashboard?.continueLearning || []).slice(0, 3).map((item, index) => {
          const subject = item.course?.subject || 'default';
          const subjectColor = SubjectColors[subject] || SubjectColors.default;
          // Use darkBg if in dark mode and available, else fallback to bg
          const bgColor = (isDark && subjectColor.darkBg) ? subjectColor.darkBg : subjectColor.bg;
          
          return (
            <TouchableOpacity
              key={item.course?._id || index}
              style={[styles.learningItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => router.push(`/course/${item.course?._id}`)}
              activeOpacity={0.7}
            >
              <View style={[styles.subjectIcon, { backgroundColor: bgColor }]}>
                <Ionicons
                  name={
                    subject === 'Mathematics' ? 'calculator' :
                    subject === 'Biology' ? 'leaf' :
                    subject === 'Chemistry' ? 'flask' :
                    subject === 'Physics' ? 'rocket' :
                    'book'
                  }
                  size={20}
                  color={subjectColor.text}
                />
              </View>
              <View style={styles.learningInfo}>
                <Text style={[styles.learningTitle, { color: colors.text }]}>{item.course?.title}</Text>
                <View style={[styles.learningProgressBg, { backgroundColor: colors.progressBg }]}>
                  <View
                    style={[styles.learningProgressFill, {
                      width: `${item.percentage}%`,
                      backgroundColor: subjectColor.text,
                    }]}
                  />
                </View>
              </View>
              <Text style={[styles.learningPercent, { color: colors.textSecondary }]}>{item.percentage}%</Text>
              <TouchableOpacity>
                <Ionicons name="ellipsis-vertical" size={18} color={colors.textTertiary} />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}

        {/* Study Hours */}
        <View style={[styles.card, { backgroundColor: colors.surface, shadowColor: colors.cardShadow, marginTop: Spacing.xl }]}>
          <View style={styles.studyHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Study Hours</Text>
            <View style={[styles.weeklyBadge, { backgroundColor: colors.surfaceSecondary }]}>
              <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: '600' }}>Weekly ▾</Text>
            </View>
          </View>
          <View style={styles.chartContainer}>
            {weekDays.map((day, i) => (
              <View key={i} style={styles.barColumn}>
                <View style={[styles.barBg, { backgroundColor: colors.progressBg }]}>
                  <View style={[styles.barFill, {
                    height: `${(studyData[i] / maxStudy) * 100}%`,
                    backgroundColor: i === 2 ? Colors.primary : Colors.primaryLight,
                    borderRadius: 4,
                  }]} />
                </View>
                <Text style={[styles.barLabel, {
                  color: i === 2 ? Colors.primary : colors.textTertiary,
                  fontWeight: i === 2 ? '700' : '500',
                }]}>{day}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.md },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  headerCenter: { flex: 1 },
  greeting: { fontSize: 20, fontWeight: '700' },
  dateText: { fontSize: 13, marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  notifButton: {
    width: 38, height: 38, borderRadius: 19,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarCircle: {
    width: 38, height: 38, borderRadius: 19,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  examHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  examTitle: { fontSize: 17, fontWeight: '700' },
  examSubtitle: { fontSize: 13, marginTop: 2 },
  examIconBg: {
    width: 40, height: 40, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  examRingContainer: { alignItems: 'center', marginVertical: Spacing.xl },
  ringOuter: {
    width: 120, height: 120,
    justifyContent: 'center', alignItems: 'center',
  },
  ringTrack: {
    position: 'absolute',
    width: 120, height: 120, borderRadius: 60,
    borderWidth: 10,
  },
  ringProgress: {
    position: 'absolute',
    width: 120, height: 120, borderRadius: 60,
    borderWidth: 10,
  },
  ringInner: {
    width: 92, height: 92, borderRadius: 46,
    justifyContent: 'center', alignItems: 'center',
  },
  ringPercent: { fontSize: 28, fontWeight: '800' },
  examFooter: { alignItems: 'center' },
  changeBadge: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  readingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700' },
  readingContent: { fontSize: 14, lineHeight: 21, marginBottom: Spacing.md },
  readingMeta: {
    flexDirection: 'row', gap: Spacing.lg,
    marginBottom: Spacing.md,
  },
  progressBarContainer: { marginTop: Spacing.xs },
  progressLabel: { fontSize: 12, marginBottom: 4 },
  progressBarRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  progressBarBg: { flex: 1, height: 6, borderRadius: 3 },
  progressBarFill: { height: 6, borderRadius: 3 },
  progressPercent: { fontSize: 12, fontWeight: '600', width: 32 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  learningItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    gap: Spacing.md,
  },
  subjectIcon: {
    width: 44, height: 44, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  learningInfo: { flex: 1, gap: 6 },
  learningTitle: { fontSize: 15, fontWeight: '600' },
  learningProgressBg: { height: 5, borderRadius: 3 },
  learningProgressFill: { height: 5, borderRadius: 3 },
  learningPercent: { fontSize: 13, fontWeight: '600', marginRight: 4 },
  studyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  weeklyBadge: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  barColumn: { alignItems: 'center', flex: 1, gap: 6 },
  barBg: {
    width: 28, height: '100%', borderRadius: 6,
    justifyContent: 'flex-end', overflow: 'hidden',
  },
  barFill: { width: '100%' },
  barLabel: { fontSize: 12 },
});
