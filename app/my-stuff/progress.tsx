import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { getDashboard } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProgressScreen() {
  const router = useRouter();
  const { theme, colors } = useTheme();

  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for chart if API doesn't return detailed daily data
  const studyHoursData = [2, 3, 5, 2, 4, 3, 1];
  const maxHours = Math.max(...studyHoursData);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const loadData = async () => {
    try {
      const data = await getDashboard();
      setDashboard(data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const examReadiness = dashboard?.examReadiness ?? 75;
  const totalStudyHours = dashboard?.totalStudyHours ?? 42;
  const totalCourses = dashboard?.totalCourses ?? 6;
  const continueLearning = dashboard?.continueLearning || [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Your Progress</Text>
        <View style={{ width: 32 }} /> 
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {/* Stats Grid */}
        <View style={styles.gridContainer}>
          {/* Exam Readiness */}
          <View style={[styles.card, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>Exam Readiness</Text>
              <Ionicons name="trending-up" size={16} color={Colors.primary} />
            </View>
            <View style={styles.readinessContainer}>
              <View style={[styles.circularProgress, { borderColor: Colors.primary }]}>
                <Text style={[styles.readinessText, { color: colors.text }]}>{examReadiness}%</Text>
              </View>
              <Text style={[styles.readinessDesc, { color: colors.textSecondary }]}>
                You've mastered <Text style={{ fontWeight: '700', color: colors.text }}>{examReadiness}%</Text> of material. Keep it up!
              </Text>
            </View>
          </View>

          {/* Study Summary */}
          <View style={[styles.card, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>Study Summary</Text>
              <Ionicons name="time-outline" size={16} color={Colors.primary} />
            </View>
            <View style={styles.studyStats}>
              <Text style={[styles.studyHours, { color: colors.text }]}>{totalStudyHours}</Text>
              <Text style={[styles.studyUnit, { color: colors.textSecondary }]}>hrs</Text>
            </View>
            <Text style={[styles.studyDesc, { color: colors.textSecondary }]}>
              <Text style={{ color: Colors.primary, fontWeight: '700' }}>{totalCourses} courses</Text> in progress
            </Text>
          </View>
        </View>

        {/* Continue Reading Card */}
        {dashboard?.continueReading ? (
             <TouchableOpacity 
                style={[styles.continueCard, { backgroundColor: Colors.primary }]}
                onPress={() => {
                     if (dashboard?.continueReading?.course?._id && dashboard?.continueReading?.chapter?._id) {
                        router.push(`/course/${dashboard.continueReading.course._id}`);
                     }
                }}
                activeOpacity={0.9}
            >
              <View style={styles.continueHeader}>
                <Text style={styles.continueTitle}>Continue Reading</Text>
                <Ionicons name="book" size={16} color="rgba(255,255,255,0.7)" />
              </View>
              <Text style={styles.continueChapter}>
                {dashboard?.continueReading?.chapter?.title ?? 'Chapter'}
              </Text>
              <Text style={styles.continueCourse}>
                {dashboard?.continueReading?.course?.title ?? 'Course'}
              </Text>
              <View style={styles.continueProgressRow}>
                <View style={styles.continueProgressBarBg}>
                  <View 
                    style={[
                        styles.continueProgressBarFill, 
                        { width: `${dashboard?.continueReading?.progress ?? 0}%` }
                    ]} 
                  />
                </View>
                <View style={styles.continueBtn}>
                    <Ionicons name="chevron-forward" size={16} color="#fff" />
                </View>
              </View>
            </TouchableOpacity>
        ) : null}

        {/* Study Hours Chart */}
        <View style={[styles.card, { backgroundColor: colors.surface, shadowColor: colors.cardShadow, marginTop: Spacing.lg }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>Study Hours</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textTertiary }]}>This Week</Text>
            </View>
            <View style={styles.chartContainer}>
                {studyHoursData.map((hours, index) => (
                    <View key={index} style={styles.chartBarContainer}>
                        <View style={[styles.chartBarBg, { backgroundColor: colors.surfaceSecondary }]}>
                            <View 
                                style={[
                                    styles.chartBarFill, 
                                    { 
                                        height: `${(hours / maxHours) * 100}%`,
                                        backgroundColor: index === 2 ? Colors.primary : Colors.primaryLight 
                                    }
                                ]} 
                            />
                        </View>
                        <Text style={[styles.chartLabel, { color: colors.textTertiary }]}>{days[index]}</Text>
                    </View>
                ))}
            </View>
        </View>

        {/* Continue Learning List */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Continue Learning</Text>
        <View style={styles.listContainer}>
            {continueLearning.length > 0 ? (
                continueLearning.map((item: any, idx: number) => (
                    <TouchableOpacity
                        key={idx}
                        style={[styles.listItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
                        onPress={() => router.push(`/course/${item.course._id}`)}
                    >
                         <View style={[styles.listIcon, { backgroundColor: Colors.primaryLight, borderRadius: 10 }]}>
                             {/* Attempt to render text icon or fallback */}
                            <Text style={{fontSize: 20}}>{item.course.icon ? item.course.icon : '📚'}</Text>
                         </View>
                         <View style={styles.listContent}>
                             <Text style={[styles.listTitle, { color: colors.text }]} numberOfLines={1}>{item.course.title}</Text>
                             <Text style={[styles.listSubtitle, { color: colors.textSecondary }]} numberOfLines={1}>{item.course.subtitle}</Text>
                         </View>
                         <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                    </TouchableOpacity>
                ))
            ) : (
                 <Text style={{ color: colors.textSecondary }}>No courses in progress</Text>
            )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  scrollContent: { padding: Spacing.lg },
  gridContainer: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.lg },
  card: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  cardTitle: { fontSize: 13, fontWeight: '600' },
  cardSubtitle: { fontSize: 11, fontWeight: '500' },
  readinessContainer: { alignItems: 'center', gap: Spacing.sm },
  circularProgress: {
    width: 60, height: 60, borderRadius: 30, borderWidth: 4,
    justifyContent: 'center', alignItems: 'center', marginBottom: 4
  },
  readinessText: { fontSize: 16, fontWeight: '800' },
  readinessDesc: { fontSize: 11, textAlign: 'center', lineHeight: 16 },
  studyStats: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginBottom: 4 },
  studyHours: { fontSize: 28, fontWeight: '800' },
  studyUnit: { fontSize: 14, fontWeight: '600' },
  studyDesc: { fontSize: 12 },
  
  continueCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  continueHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  continueTitle: { color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: '600' },
  continueChapter: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 2 },
  continueCourse: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: Spacing.lg },
  continueProgressRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  continueProgressBarBg: { flex: 1, height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3 },
  continueProgressBarFill: { height: 6, backgroundColor: '#fff', borderRadius: 3 },
  continueBtn: { width: 32, height: 32, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },

  chartContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 120, paddingTop: Spacing.sm },
  chartBarContainer: { alignItems: 'center', gap: 6, flex: 1 },
  chartBarBg: { width: 8, height: '100%', borderRadius: 4, justifyContent: 'flex-end', overflow: 'hidden' },
  chartBarFill: { width: '100%', borderRadius: 4 },
  chartLabel: { fontSize: 10, fontWeight: '500' },

  sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: Spacing.xl, marginBottom: Spacing.md },
  listContainer: { gap: Spacing.sm },
  listItem: {
      flexDirection: 'row', alignItems: 'center', padding: Spacing.md,
      borderRadius: BorderRadius.md, borderWidth: 1, gap: Spacing.md
  },
  listIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  listContent: { flex: 1 },
  listTitle: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  listSubtitle: { fontSize: 12 },
});
