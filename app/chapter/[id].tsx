import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Chapter, getChapterById } from '@/services/chapters';
import { Course, getCourseById } from '@/services/courses';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
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

export default function ChapterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const chapterData = await getChapterById(id!);
      setChapter(chapterData);

      if (chapterData.courseId) {
        try {
          const courseData = await getCourseById(chapterData.courseId);
          setCourse(courseData);
        } catch {}
      }
    } catch (error) {
      console.error('Failed to load chapter:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Split content into paragraphs
  const contentParagraphs = chapter?.content?.split('\n\n') || [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.logoRow}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoLetter}>E</Text>
            </View>
            <Text style={[styles.logoText, { color: theme.text }]}>EduFocus</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => setIsBookmarked(!isBookmarked)}
          style={styles.bookmarkBtn}
        >
          <Ionicons
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={22}
            color={isBookmarked ? Colors.primary : theme.text}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Breadcrumbs */}
        <View style={styles.breadcrumbs}>
          <TouchableOpacity onPress={() => course && router.push(`/course/${course._id}`)}>
            <Text style={[styles.breadcrumbLink, { color: Colors.primary }]}>
              {course?.subject?.toUpperCase() || 'COURSE'}
            </Text>
          </TouchableOpacity>
          <Ionicons name="chevron-forward" size={14} color={theme.textTertiary} />
          <Text style={[styles.breadcrumbText, { color: theme.textSecondary }]}>
            Chapter {chapter?.order}
          </Text>
        </View>

        {/* Title */}
        <Text style={[styles.chapterTitle, { color: theme.text }]}>{chapter?.title}</Text>

        {/* Content */}
        {contentParagraphs.map((paragraph, index) => (
          <Text key={index} style={[styles.paragraph, { color: theme.text }]}>
            {paragraph}
          </Text>
        ))}

        {/* Image */}
        {chapter?.imageUrl ? (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: chapter.imageUrl }}
              style={styles.contentImage}
              contentFit="cover"
            />
            <Text style={[styles.imageCaption, { color: theme.textTertiary }]}>
              Figure {chapter.order}.1
            </Text>
          </View>
        ) : null}

        {/* Reading time */}
        <View style={[styles.readingInfo, { backgroundColor: theme.surfaceSecondary }]}>
          <Ionicons name="time-outline" size={16} color={theme.textSecondary} />
          <Text style={[styles.readingTime, { color: theme.textSecondary }]}>
            {chapter?.readingTime || '15 min read'}
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Chat / AI Button */}
      <TouchableOpacity style={styles.fabButton} activeOpacity={0.8}>
        <Ionicons name="chatbubble-ellipses" size={24} color="#fff" />
      </TouchableOpacity>
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
  },
  backBtn: { padding: 4 },
  headerCenter: { flex: 1, alignItems: 'center' },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoIcon: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center',
    marginRight: 6,
  },
  logoLetter: { color: '#fff', fontSize: 14, fontWeight: '700' },
  logoText: { fontSize: 16, fontWeight: '700' },
  bookmarkBtn: { padding: 4 },
  scrollContent: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl },
  breadcrumbs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.md,
  },
  breadcrumbLink: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  breadcrumbText: { fontSize: 12 },
  chapterTitle: {
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 34,
    marginBottom: Spacing.xl,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  imageContainer: {
    marginVertical: Spacing.xl,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  contentImage: {
    width: '100%',
    height: 200,
    borderRadius: BorderRadius.lg,
  },
  imageCaption: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: Spacing.sm,
    fontStyle: 'italic',
  },
  readingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignSelf: 'flex-start',
    marginTop: Spacing.md,
  },
  readingTime: { fontSize: 13, fontWeight: '500' },
  fabButton: {
    position: 'absolute',
    bottom: 30,
    right: Spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
});
