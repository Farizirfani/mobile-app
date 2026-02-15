import { BorderRadius, Colors, Spacing, SubjectColors } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Course, getCourses } from '@/services/courses';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookmarksScreen() {
  const router = useRouter();
  const { theme, colors } = useTheme();
  const [bookmarks, setBookmarks] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
        // Since backend handles bookmarks, we fetch all courses containing isBookmarked=true or similar
        // Or we might iterate all courses and filter.
        // Assuming getCourses returns isBookmarked flag on each course object for authenticated user:
        const allCourses = await getCourses();
        const bookmarked = allCourses.filter(c => c.isBookmarked);
        // For demo purposes, we might not have 'isBookmarked' fully working, 
        // so we'll mock it if list is empty for this task context?
        // Actually, let's rely on API response.
        setBookmarks(bookmarked);
    } catch (e) {
      console.error('Failed to load bookmarks', e);
    } finally {
        setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Bookmarks</Text>
        <View style={{ width: 32 }} /> 
      </View>

      {loading ? (
          <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
          </View>
      ) : (
          <FlatList
            data={bookmarks}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
                const subjectColor = SubjectColors[item.subject || 'default'] || SubjectColors.default;
                return (
                    <TouchableOpacity
                      style={[styles.courseCard, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }]}
                      onPress={() => router.push(`/course/${item._id}`)}
                    >
                        <View style={styles.courseContent}>
                            <View style={[styles.courseIcon, { backgroundColor: subjectColor.bg }]}>
                                <Ionicons name="book" size={24} color={subjectColor.text} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.courseTitle, { color: colors.text }]}>{item.title}</Text>
                                <Text style={[styles.courseSubtitle, { color: colors.textSecondary }]}>{item.subtitle}</Text>
                            </View>
                            <Ionicons name="bookmark" size={20} color={Colors.primary} />
                        </View>
                    </TouchableOpacity>
                );
            }}
            ListEmptyComponent={
                <View style={styles.emptyContainer}>
                    <Ionicons name="bookmark-outline" size={48} color={colors.textTertiary} />
                    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No bookmarks yet</Text>
                    <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
                        Save courses to access them quickly here.
                    </Text>
                </View>
            }
          />
      )}
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
  listContent: { padding: Spacing.lg },
  courseCard: {
      padding: Spacing.lg, borderRadius: BorderRadius.lg,
      marginBottom: Spacing.md,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 2,
  },
  courseContent: { flexDirection: 'row', gap: Spacing.md, alignItems: 'center' },
  courseIcon: {
      width: 48, height: 48, borderRadius: 12,
      justifyContent: 'center', alignItems: 'center',
  },
  courseTitle: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  courseSubtitle: { fontSize: 13 },
  emptyContainer: { alignItems: 'center', paddingVertical: Spacing.xl * 2, gap: Spacing.md },
  emptyText: { fontSize: 18, fontWeight: '600' },
  emptySubtext: { fontSize: 14, textAlign: 'center' },
});
