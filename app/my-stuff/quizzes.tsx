import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface QuizResult {
  id: string;
  chapterId: string;
  score: number;
  totalQuestions: number;
  date: string;
}

export default function QuizzesScreen() {
  const router = useRouter();
  const { theme, colors } = useTheme();
  const [results, setResults] = useState<QuizResult[]>([]);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      // We need to implement saving this in quiz.tsx first, but assuming structure
      const savedResults = await AsyncStorage.getItem('user_quiz_results');
      if (savedResults) {
        const parsed: QuizResult[] = JSON.parse(savedResults);
        parsed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setResults(parsed);
      }
    } catch (e) {
      console.error('Failed to load quiz results', e);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Quiz Results</Text>
        <View style={{ width: 32 }} /> 
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
            const percentage = Math.round((item.score / item.totalQuestions) * 100);
            const passed = percentage >= 70;
            return (
                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={styles.cardHeader}>
                         <View>
                            <Text style={[styles.cardTitle, { color: colors.text }]}>Chapter Quiz</Text>
                            <Text style={[styles.cardDate, { color: colors.textSecondary }]}>
                                {new Date(item.date).toLocaleDateString()}
                            </Text>
                         </View>
                         <View style={[styles.scoreBadge, { backgroundColor: passed ? '#F0FDF4' : '#FEF2F2' }]}>
                             <Text style={[styles.scoreText, { color: passed ? '#22C55E' : '#EF4444' }]}>
                                 {percentage}%
                             </Text>
                         </View>
                    </View>
                    <View style={styles.cardFooter}>
                        <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                            Score: {item.score}/{item.totalQuestions}
                        </Text>
                        <TouchableOpacity onPress={() => router.push(`/chapter/${item.chapterId}`)}>
                            <Text style={{ color: Colors.primary, fontWeight: '600', fontSize: 13 }}>Go to Chapter</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }}
        ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Ionicons name="trophy-outline" size={48} color={colors.textTertiary} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No quizzes yet</Text>
                <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
                    Complete quizzes in chapters to track your scores.
                </Text>
            </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  listContent: { padding: Spacing.lg },
  card: {
      padding: Spacing.md, borderRadius: BorderRadius.lg,
      borderWidth: 1, marginBottom: Spacing.md
  },
  cardHeader: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      marginBottom: Spacing.md
  },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardDate: { fontSize: 12 },
  scoreBadge: {
      paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6
  },
  scoreText: { fontWeight: '700', fontSize: 14 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailText: { fontSize: 13 },
  emptyContainer: { alignItems: 'center', paddingVertical: Spacing.xl * 2, gap: Spacing.md },
  emptyText: { fontSize: 18, fontWeight: '600' },
  emptySubtext: { fontSize: 14, textAlign: 'center' },
});
