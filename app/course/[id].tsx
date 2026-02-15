import { BorderRadius, Colors, Spacing, SubjectColors } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Chapter, getChaptersByCourse } from '@/services/chapters';
import { Course, getCourseById } from '@/services/courses';
import { getCourseProgress, Progress } from '@/services/progress';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme, colors, isDark } = useTheme();

  const [course, setCourse] = useState<Course | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [courseData, chaptersData] = await Promise.all([
        getCourseById(id!),
        getChaptersByCourse(id!),
      ]);
      setCourse(courseData);
      setChapters(chaptersData);

      try {
        const progressData = await getCourseProgress(id!);
        setProgress(progressData);
      } catch {}
    } catch (error) {
      console.error('Failed to load course:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const subjectColor = SubjectColors[course?.subject || 'default'] || SubjectColors.default;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          {course?.title}
        </Text>
        <TouchableOpacity style={styles.moreBtn}>
          <Ionicons name="bookmark-outline" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Course Info */}
        <View style={[styles.infoCard, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }]}>
          <View style={[styles.courseIcon, { backgroundColor: subjectColor.bg }]}>
            <Ionicons
              name={
                course?.subject === 'Mathematics' ? 'calculator' :
                course?.subject === 'Biology' ? 'leaf' :
                course?.subject === 'Chemistry' ? 'flask' :
                course?.subject === 'Physics' ? 'rocket' :
                'book'
              }
              size={32}
              color={subjectColor.text}
            />
          </View>
          <Text style={[styles.courseTitle, { color: colors.text }]}>{course?.title}</Text>
          <Text style={[styles.courseSubtitle, { color: colors.textSecondary }]}>{course?.subtitle}</Text>
          {course?.description && (
            <Text style={[styles.courseDesc, { color: colors.textSecondary }]}>{course.description}</Text>
          )}
          {progress && (
            <View style={styles.progressSection}>
              <View style={styles.progressRow}>
                <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>Progress</Text>
                <Text style={[styles.progressPercent, { color: Colors.primary }]}>{progress.percentage}%</Text>
              </View>
              <View style={[styles.progressBarBg, { backgroundColor: colors.progressBg }]}>
                <View style={[styles.progressBarFill, {
                  width: `${progress.percentage}%`,
                  backgroundColor: Colors.primary,
                }]} />
              </View>
            </View>
          )}
        </View>

        {/* Chapters List */}
        <Text style={[styles.chaptersTitle, { color: colors.text }]}>
          Chapters ({chapters.length})
        </Text>
        {chapters.sort((a, b) => a.order - b.order).map((chapter, index) => (
          <TouchableOpacity
            key={chapter._id}
            style={[styles.chapterItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => router.push(`/chapter/${chapter._id}`)}
            activeOpacity={0.7}
          >
            <View style={[styles.chapterNumber, { backgroundColor: subjectColor.bg }]}>
              <Text style={[styles.chapterNumberText, { color: subjectColor.text }]}>{chapter.order}</Text>
            </View>
            <View style={styles.chapterInfo}>
              <Text style={[styles.chapterTitle, { color: colors.text }]}>{chapter.title}</Text>
              <Text style={[styles.chapterMeta, { color: colors.textTertiary }]}>
                {chapter.readingTime || `${Math.ceil((chapter.content?.length || 500) / 200)} min read`}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        ))}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    gap: Spacing.md,
  },
  backBtn: { padding: 4 },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '700' },
  moreBtn: { padding: 4 },
  scrollContent: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl },
  infoCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xxl,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  courseIcon: {
    width: 64, height: 64, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: Spacing.md,
  },
  courseTitle: { fontSize: 22, fontWeight: '800', textAlign: 'center', marginBottom: 4 },
  courseSubtitle: { fontSize: 14, textAlign: 'center', marginBottom: Spacing.sm },
  courseDesc: { fontSize: 13, textAlign: 'center', lineHeight: 20 },
  progressSection: { width: '100%', marginTop: Spacing.lg },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: { fontSize: 13 },
  progressPercent: { fontSize: 13, fontWeight: '700' },
  progressBarBg: { height: 6, borderRadius: 3 },
  progressBarFill: { height: 6, borderRadius: 3 },
  chaptersTitle: { fontSize: 18, fontWeight: '700', marginBottom: Spacing.md },
  chapterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    gap: Spacing.md,
  },
  chapterNumber: {
    width: 40, height: 40, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  chapterNumberText: { fontSize: 16, fontWeight: '700' },
  chapterInfo: { flex: 1 },
  chapterTitle: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  chapterMeta: { fontSize: 12 },
});
