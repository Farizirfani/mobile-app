import { BorderRadius, Colors, Spacing, SubjectColors } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Course, getCourses } from '@/services/courses';
import { getProgress, Progress } from '@/services/progress';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CATEGORIES = ['All Subjects', 'Science', 'Mathematics', 'Languages'];

export default function CoursesScreen() {
  const router = useRouter();
  const { theme, colors, isDark } = useTheme();

  const [courses, setCourses] = useState<Course[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, Progress>>({});
  const [selectedCategory, setSelectedCategory] = useState('All Subjects');
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const category = selectedCategory === 'All Subjects' ? undefined : selectedCategory;
      const [coursesData, progressData] = await Promise.all([
        getCourses(category),
        getProgress(),
      ]);
      setCourses(coursesData);
      const pMap: Record<string, Progress> = {};
      progressData.forEach((p: Progress) => {
        pMap[p.courseId] = p;
      });
      setProgressMap(pMap);
    } catch (error) {
      console.error('Failed to load courses:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'completed': return { text: 'Completed', color: '#22C55E', bg: '#F0FDF4' };
      case 'in_progress': return { text: 'In Progress', color: Colors.primary, bg: '#EEF2FF' };
      default: return { text: 'Not Started', color: '#94A3B8', bg: '#F1F5F9' };
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.logoRow}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoLetter}>E</Text>
            </View>
            <Text style={[styles.logoText, { color: colors.text }]}>EduFocus</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.surfaceSecondary }]}>
              <Ionicons name="notifications-outline" size={20} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.surfaceSecondary }]}>
              <Ionicons name="bookmark-outline" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Title */}
        <Text style={[styles.pageTitle, { color: colors.text }]}>Course Library</Text>
        <Text style={[styles.pageSubtitle, { color: colors.textSecondary }]}>
          Explore your subjects and track your progress
        </Text>

        {/* Category Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryTab,
                selectedCategory === cat
                  ? { backgroundColor: Colors.primary }
                  : { backgroundColor: colors.surfaceSecondary },
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[
                styles.categoryText,
                { color: selectedCategory === cat ? '#fff' : colors.textSecondary },
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Course Cards */}
        {courses.map((course) => {
          const progress = progressMap[course._id];
          const percentage = progress?.percentage || 0;
          const status = getStatusLabel(progress?.status);
          const subjectColor = SubjectColors[course.subject] || SubjectColors.default;
          // Use darkBg if in dark mode and available, else fallback to bg
          const bgColor = (isDark && subjectColor.darkBg) ? subjectColor.darkBg : subjectColor.bg;

          return (
            <TouchableOpacity
              key={course._id}
              style={[styles.courseCard, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }]}
              onPress={() => router.push(`/course/${course._id}`)}
              activeOpacity={0.7}
            >
              <View style={styles.courseContent}>
                <View style={[styles.courseIcon, { backgroundColor: bgColor }]}>
                  <Ionicons
                    name={
                      course.subject === 'Mathematics' ? 'calculator' :
                      course.subject === 'Biology' ? 'leaf' :
                      course.subject === 'Chemistry' ? 'flask' :
                      course.subject === 'Physics' ? 'rocket' :
                      course.subject === 'History' ? 'time' :
                      course.subject === 'English' ? 'chatbubbles' :
                      'book'
                    }
                    size={24}
                    color={subjectColor.text}
                  />
                </View>
                <View style={styles.courseInfo}>
                  <Text style={[styles.courseTitle, { color: colors.text }]}>{course.title}</Text>
                  <Text style={[styles.courseSubtitle, { color: colors.textSecondary }]}>{course.subtitle}</Text>

                  <View style={styles.statusRow}>
                    <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                      <Text style={[styles.statusText, { color: status.color }]}>{status.text}</Text>
                    </View>
                    <Text style={[styles.percentText, { color: colors.textSecondary }]}>{percentage}%</Text>
                  </View>

                  <View style={[styles.courseProgressBg, { backgroundColor: colors.progressBg }]}>
                    <View style={[styles.courseProgressFill, {
                      width: `${percentage}%`,
                      backgroundColor: status.color,
                    }]} />
                  </View>

                  {/* Avatars row */}
                  <View style={styles.avatarsRow}>
                    <View style={styles.avatarStack}>
                      {[0, 1, 2].map((i) => (
                        <View key={i} style={[styles.miniAvatar, {
                          backgroundColor: ['#E6D5C3', '#C3D5E6', '#D5E6C3'][i],
                          left: i * 18,
                          zIndex: 3 - i
                        }]} />
                      ))}
                    </View>
                    <Text style={[styles.studentsText, { color: colors.textTertiary }]}>
                      +52 classmates
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Load More */}
        <TouchableOpacity
          style={[styles.loadMoreButton, { borderColor: colors.border }]}
          activeOpacity={0.7}
        >
          <Text style={[styles.loadMoreText, { color: colors.textSecondary }]}>Load More Courses</Text>
        </TouchableOpacity>

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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoIcon: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center',
    marginRight: Spacing.sm,
  },
  logoLetter: { color: '#fff', fontSize: 16, fontWeight: '700' },
  logoText: { fontSize: 18, fontWeight: '700' },
  headerRight: { flexDirection: 'row', gap: Spacing.sm },
  iconButton: {
    width: 38, height: 38, borderRadius: 19,
    justifyContent: 'center', alignItems: 'center',
  },
  pageTitle: { fontSize: 26, fontWeight: '800', marginBottom: 4 },
  pageSubtitle: { fontSize: 14, marginBottom: Spacing.lg },
  categoryScroll: { marginBottom: Spacing.xl },
  categoryContainer: { gap: Spacing.sm },
  categoryTab: {
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: BorderRadius.full,
  },
  categoryText: { fontSize: 13, fontWeight: '600' },
  courseCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  courseContent: { flexDirection: 'row', gap: Spacing.md },
  courseIcon: {
    width: 48, height: 48, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
    marginTop: 2,
  },
  courseInfo: { flex: 1 },
  courseTitle: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  courseSubtitle: { fontSize: 13, marginBottom: Spacing.sm },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  statusText: { fontSize: 12, fontWeight: '600' },
  percentText: { fontSize: 12, fontWeight: '600' },
  courseProgressBg: { height: 5, borderRadius: 3, marginBottom: Spacing.sm },
  courseProgressFill: { height: 5, borderRadius: 3 },
  avatarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  avatarStack: {
    flexDirection: 'row',
    width: 60,
    height: 24,
  },
  miniAvatar: {
    width: 24, height: 24, borderRadius: 12,
    position: 'absolute',
    borderWidth: 2, borderColor: '#fff',
  },
  studentsText: { fontSize: 12, marginLeft: 10 },
  loadMoreButton: {
    borderWidth: 1.5,
    borderRadius: BorderRadius.lg,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  loadMoreText: { fontSize: 15, fontWeight: '600' },
});
