import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

// Mock data - in real app, fetch from API based on chapterId or pass as params
const mockQuestions: Question[] = [
  {
    id: 1,
    text: "What is the primary function of the mitochondria?",
    options: [
      "Protein synthesis",
      "Energy production (ATP)",
      "Cell division",
      "Waste removal"
    ],
    correctAnswer: 1
  },
  {
    id: 2,
    text: "Which of the following is NOT a type of RNA?",
    options: [
      "mRNA",
      "tRNA",
      "dRNA",
      "rRNA"
    ],
    correctAnswer: 2
  },
  {
    id: 3,
    text: "What is the process by which cells divide?",
    options: [
      "Mitosis",
      "Osmosis",
      "Diffusion",
      "Respiration"
    ],
    correctAnswer: 0
  }
];

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>(); // chapterId
  const router = useRouter();
  const { theme, colors, isDark } = useTheme();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = mockQuestions[currentQuestionIndex];

  const handleAnswerSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);

    if (index === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
      submitProgress(score + (selectedAnswer === currentQuestion.correctAnswer ? 1 : 0));
    }
  };

  const submitProgress = async (finalScore: number) => {
      const percentage = Math.round((finalScore / mockQuestions.length) * 100);
      try {
          // Save quiz result locally
          const result = {
              id: Date.now().toString(),
              chapterId: id!,
              score: finalScore,
              totalQuestions: mockQuestions.length,
              date: new Date().toISOString()
          };

          const savedResults = await AsyncStorage.getItem('user_quiz_results');
          const existingResults = savedResults ? JSON.parse(savedResults) : [];
          await AsyncStorage.setItem('user_quiz_results', JSON.stringify([...existingResults, result]));

          console.log(`Submitting progress: ${percentage}%`);
          // await updateProgress({ chapterId: id, percentage }); 
      } catch (e) {
          console.log("Error updating progress", e);
      }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
  };


  if (showResults) {
    const percentage = Math.round((score / mockQuestions.length) * 100);
    const passed = percentage >= 70;

    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.resultContainer}>
          <View style={[styles.resultIcon, { backgroundColor: colors.surface }]}>
            <Ionicons name="trophy" size={64} color={Colors.primary} />
          </View>
          <Text style={[styles.resultTitle, { color: colors.text }]}>Quiz Completed!</Text>
          <Text style={[styles.resultScore, { color: colors.textSecondary }]}>
            You scored {percentage}% ({score}/{mockQuestions.length})
          </Text>

          <View style={[styles.progressBarBg, { backgroundColor: colors.surfaceSecondary }]}>
            <View 
                style={[
                    styles.progressBarFill, 
                    { 
                        width: `${percentage}%`,
                        backgroundColor: passed ? Colors.accent : Colors.primary // using accent as success color substitute if needed or just Green
                    }
                ]} 
            />
          </View>

          <TouchableOpacity
            style={[styles.retryBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={handleRetry}
          >
            <Ionicons name="refresh" size={20} color={colors.text} />
            <Text style={[styles.retryText, { color: colors.text }]}>Try Again</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.finishBtn, { backgroundColor: Colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={styles.finishText}>Back to Chapter</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
       <Stack.Screen options={{ headerShown: false }} />
       {/* Header */}
       <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Quiz</Text>
        <View style={{ width: 32 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Progress Bar */}
        <View style={styles.progressSection}>
            <View style={styles.progressLabels}>
                <Text style={[styles.questionCount, { color: colors.textSecondary }]}>
                    Question {currentQuestionIndex + 1} of {mockQuestions.length}
                </Text>
                <Text style={[styles.scoreCount, { color: colors.textSecondary }]}>
                    Score: {score}
                </Text>
            </View>
            <View style={[styles.track, { backgroundColor: colors.surfaceSecondary }]}>
                <View 
                    style={[
                        styles.trackFill, 
                        { width: `${((currentQuestionIndex + 1) / mockQuestions.length) * 100}%`, backgroundColor: Colors.primary }
                    ]} 
                />
            </View>
        </View>

        {/* Question */}
        <Text style={[styles.questionText, { color: colors.text }]}>
            {currentQuestion.text}
        </Text>

        {/* Options */}
        <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => {
                let borderColor = colors.border;
                let backgroundColor = colors.surface;
                let iconName = null;
                let iconColor = null;

                if (isAnswered) {
                    if (index === currentQuestion.correctAnswer) {
                        borderColor = Colors.accent;
                        backgroundColor = `${Colors.accent}20`; // Light green
                        iconName = "checkmark-circle";
                        iconColor = Colors.accent;
                    } else if (index === selectedAnswer) {
                        borderColor = colors.error;
                        backgroundColor = `${colors.error}20`;
                        iconName = "close-circle";
                        iconColor = colors.error;
                    } else {
                        borderColor = colors.border;
                        // opacity handled by style
                    }
                } else if (selectedAnswer === index) {
                    borderColor = Colors.primary;
                    backgroundColor = Colors.primaryLight; 
                }

                return (
                    <TouchableOpacity
                        key={index}
                        disabled={isAnswered}
                        style={[
                            styles.optionBtn,
                            { borderColor, backgroundColor },
                            isAnswered && index !== currentQuestion.correctAnswer && index !== selectedAnswer && { opacity: 0.5 }
                        ]}
                        onPress={() => handleAnswerSelect(index)}
                    >
                        <View style={styles.optionContent}>
                            <View style={[styles.optionLetter, { borderColor: colors.border, backgroundColor: colors.background }]}>
                                <Text style={[styles.optionLetterText, { color: colors.textSecondary }]}>
                                    {String.fromCharCode(65 + index)}
                                </Text>
                            </View>
                            <Text style={[styles.optionText, { color: colors.text }]}>{option}</Text>
                        </View>
                        {iconName && (
                            <Ionicons name={iconName as any} size={24} color={iconColor!} />
                        )}
                    </TouchableOpacity>
                );
            })}
        </View>
      </ScrollView>

      {/* Footer / Next Button */}
      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[
                styles.nextBtn, 
                { backgroundColor: isAnswered ? Colors.primary : colors.surfaceSecondary },
                !isAnswered && { opacity: 0.7 }
            ]}
            disabled={!isAnswered}
            onPress={handleNextQuestion}
          >
              <Text style={[styles.nextBtnText, { color: isAnswered ? '#fff' : colors.textTertiary }]}>
                  {currentQuestionIndex < mockQuestions.length - 1 ? 'Next Question' : 'View Results'}
              </Text>
              <Ionicons name="arrow-forward" size={20} color={isAnswered ? '#fff' : colors.textTertiary} />
          </TouchableOpacity>
      </View>

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
  content: { padding: Spacing.lg },
  progressSection: { marginBottom: Spacing.xl },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  questionCount: { fontSize: 12, fontWeight: '600' },
  scoreCount: { fontSize: 12, fontWeight: '600' },
  track: { height: 6, borderRadius: 3, overflow: 'hidden' },
  trackFill: { height: '100%', borderRadius: 3 },
  questionText: { fontSize: 20, fontWeight: '700', lineHeight: 28, marginBottom: Spacing.xl },
  optionsContainer: { gap: Spacing.md },
  optionBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      padding: Spacing.md, borderRadius: BorderRadius.lg, borderWidth: 2,
  },
  optionContent: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flex: 1 },
  optionLetter: {
      width: 32, height: 32, borderRadius: 8, borderWidth: 1,
      justifyContent: 'center', alignItems: 'center'
  },
  optionLetterText: { fontSize: 14, fontWeight: '700' },
  optionText: { fontSize: 16, fontWeight: '500', flex: 1 },
  footer: { padding: Spacing.lg, borderTopWidth: 1 },
  nextBtn: { 
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
      paddingVertical: Spacing.md, borderRadius: BorderRadius.lg 
  },
  nextBtnText: { fontSize: 16, fontWeight: '700' },

  // Results
  resultContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  resultIcon: { 
      width: 100, height: 100, borderRadius: 50, 
      justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.xl 
  },
  resultTitle: { fontSize: 24, fontWeight: '800', marginBottom: Spacing.sm },
  resultScore: { fontSize: 16, marginBottom: Spacing.xl },
  progressBarBg: { width: '100%', height: 12, borderRadius: 6, marginBottom: Spacing.xxl, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 6 },
  retryBtn: { 
      flexDirection: 'row', alignItems: 'center', gap: 8,
      paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl,
      borderRadius: BorderRadius.lg, borderWidth: 1, marginBottom: Spacing.md, width: '100%', justifyContent: 'center'
  },
  retryText: { fontSize: 16, fontWeight: '600' },
  finishBtn: {
      paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl,
      borderRadius: BorderRadius.lg, width: '100%', alignItems: 'center'
  },
  finishText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
