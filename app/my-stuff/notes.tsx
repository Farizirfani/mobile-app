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

interface Note {
  id: string;
  content: string;
  createdAt: string;
  chapterId: string;
}

export default function NotesScreen() {
  const router = useRouter();
  const { theme, colors } = useTheme();
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('user_notes');
      if (savedNotes) {
        const parsedNotes: Note[] = JSON.parse(savedNotes);
        // Sort by date desc
        parsedNotes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setNotes(parsedNotes);
      }
    } catch (e) {
      console.error('Failed to load notes', e);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Notes</Text>
        <View style={{ width: 32 }} /> 
      </View>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
            <View style={[styles.noteCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.noteHeader}>
                    <View style={styles.noteMeta}>
                        <Ionicons name="document-text-outline" size={14} color={colors.textTertiary} />
                        <Text style={[styles.noteDate, { color: colors.textTertiary }]}>
                            {new Date(item.createdAt).toLocaleDateString()}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => router.push(`/chapter/${item.chapterId}`)}>
                         <Text style={{ fontSize: 12, color: Colors.primary, fontWeight: '600' }}>Generic Chapter</Text>
                         {/* Ideally we'd look up chapter name here or store it with note */}
                    </TouchableOpacity>
                </View>
                <Text style={[styles.noteContent, { color: colors.text }]} numberOfLines={3}>{item.content}</Text>
            </View>
        )}
        ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Ionicons name="document-text-outline" size={48} color={colors.textTertiary} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No notes yet</Text>
                <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
                    Take notes while studying chapters to see them here.
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
  noteCard: {
      padding: Spacing.md, borderRadius: BorderRadius.lg,
      borderWidth: 1, marginBottom: Spacing.md
  },
  noteHeader: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      marginBottom: Spacing.sm
  },
  noteMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  noteDate: { fontSize: 12 },
  noteContent: { fontSize: 14, lineHeight: 22 },
  emptyContainer: { alignItems: 'center', paddingVertical: Spacing.xl * 2, gap: Spacing.md },
  emptyText: { fontSize: 18, fontWeight: '600' },
  emptySubtext: { fontSize: 14, textAlign: 'center' },
});
