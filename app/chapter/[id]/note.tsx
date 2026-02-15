import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Note {
  id: string;
  content: string;
  createdAt: string;
  chapterId: string;
}

export default function NoteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>(); // chapterId
  const router = useRouter();
  const { theme, colors, isDark } = useTheme();

  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('user_notes');
      if (savedNotes) {
        const parsedNotes: Note[] = JSON.parse(savedNotes);
        // Filter for current chapter
        setNotes(parsedNotes.filter(n => n.chapterId === id));
      }
    } catch (e) {
      console.error('Failed to load notes', e);
    }
  };

  const saveNotesToStorage = async (updatedNotes: Note[]) => {
      try {
          // We need to merge with existing notes from other chapters
          const savedNotes = await AsyncStorage.getItem('user_notes');
          let allNotes: Note[] = savedNotes ? JSON.parse(savedNotes) : [];
          
          // Remove old notes for this chapter from allNotes to avoid duplication issues if we were editing (though here we just add/delete)
          // Actually, simplest is to filter out THIS chapter's notes from allNotes, then append updatedNotes
          const otherChapterNotes = allNotes.filter(n => n.chapterId !== id);
          const newAllNotes = [...otherChapterNotes, ...updatedNotes];
          
          await AsyncStorage.setItem('user_notes', JSON.stringify(newAllNotes));
      } catch (e) {
          console.error('Failed to save notes', e);
      }
  };

  const handleSaveNote = async () => {
    if (!currentNote.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(), // Simple ID
      content: currentNote,
      createdAt: new Date().toISOString(),
      chapterId: id!,
    };

    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    await saveNotesToStorage(updatedNotes);
    
    setCurrentNote('');
    setIsFocused(false);
    Keyboard.dismiss();
  };

  const handleDeleteNote = async (noteId: string) => {
    Alert.alert(
        "Delete Note",
        "Are you sure you want to delete this note?",
        [
            { text: "Cancel", style: "cancel" },
            { 
                text: "Delete", 
                style: "destructive", 
                onPress: async () => {
                    const updatedNotes = notes.filter(n => n.id !== noteId);
                    setNotes(updatedNotes);
                    await saveNotesToStorage(updatedNotes);
                }
            }
        ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
          {/* Header */}
          <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>My Notes</Text>
            <View style={{ width: 32 }} /> 
          </View>

          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
                <FlatList
                    data={notes}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    ListHeaderComponent={
                        <View style={styles.inputContainer}>
                             <View 
                                style={[
                                    styles.inputWrapper, 
                                    { 
                                        backgroundColor: colors.surface, 
                                        borderColor: isFocused ? Colors.primary : colors.border 
                                    }
                                ]}
                            >
                                <TextInput
                                    style={[styles.input, { color: colors.text }]}
                                    placeholder="Write your note here..."
                                    placeholderTextColor={colors.textTertiary}
                                    multiline
                                    value={currentNote}
                                    onChangeText={setCurrentNote}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                />
                                {currentNote.length > 0 && (
                                    <View style={[styles.inputFooter, { borderTopColor: colors.border }]}>
                                        <TouchableOpacity 
                                            onPress={() => {
                                                setCurrentNote('');
                                                Keyboard.dismiss();
                                            }}
                                            style={styles.cancelBtn}
                                        >
                                            <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            onPress={handleSaveNote}
                                            style={[styles.saveBtn, { backgroundColor: Colors.primary }]}
                                        >
                                            <Ionicons name="save-outline" size={16} color="#fff" />
                                            <Text style={styles.saveText}>Save Note</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <View style={[styles.noteCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <View style={styles.noteHeader}>
                                <View style={styles.noteMeta}>
                                    <Ionicons name="time-outline" size={12} color={colors.textTertiary} />
                                    <Text style={[styles.noteDate, { color: colors.textTertiary }]}>
                                        {new Date(item.createdAt).toLocaleDateString()} • {new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={() => handleDeleteNote(item.id)} style={styles.deleteBtn}>
                                    <Ionicons name="trash-outline" size={16} color={colors.textTertiary} />
                                </TouchableOpacity>
                            </View>
                            <Text style={[styles.noteContent, { color: colors.text }]}>{item.content}</Text>
                        </View>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <View style={[styles.emptyIcon, { backgroundColor: colors.surfaceSecondary }]}>
                                <Ionicons name="create-outline" size={32} color={colors.textTertiary} />
                            </View>
                            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No notes yet</Text>
                            <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
                                Start typing above to add a note for this chapter
                            </Text>
                        </View>
                    }
                />
            </View>
          </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
  listContent: { padding: Spacing.lg, paddingBottom: 100 },
  
  inputContainer: { marginBottom: Spacing.xl },
  inputWrapper: {
      borderRadius: BorderRadius.lg, borderWidth: 1, 
      overflow: 'hidden', minHeight: 120
  },
  input: {
      flex: 1, padding: Spacing.md, fontSize: 15, lineHeight: 22,
      minHeight: 80, textAlignVertical: 'top'
  },
  inputFooter: {
      flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center',
      padding: Spacing.sm, borderTopWidth: 1, gap: Spacing.sm
  },
  cancelBtn: { paddingHorizontal: Spacing.md, paddingVertical: 6 },
  cancelText: { fontSize: 13, fontWeight: '600' },
  saveBtn: {
      flexDirection: 'row', alignItems: 'center', gap: 4,
      paddingHorizontal: Spacing.md, paddingVertical: 6, borderRadius: BorderRadius.md
  },
  saveText: { color: '#fff', fontSize: 13, fontWeight: '600' },

  noteCard: {
      padding: Spacing.md, borderRadius: BorderRadius.lg,
      borderWidth: 1, marginBottom: Spacing.md
  },
  noteHeader: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
      marginBottom: Spacing.sm
  },
  noteMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  noteDate: { fontSize: 11 },
  deleteBtn: { padding: 4 },
  noteContent: { fontSize: 14, lineHeight: 22 },

  emptyContainer: { alignItems: 'center', paddingVertical: Spacing.xl },
  emptyIcon: { 
      width: 64, height: 64, borderRadius: 32, 
      justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.md 
  },
  emptyText: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  emptySubtext: { fontSize: 13, textAlign: 'center' },
});
