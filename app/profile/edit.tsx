import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { updateProfile } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuth(); // Assuming updateUser exists in AuthContext, if not we'll rely on global user reload or just nav back
  const { theme, colors } = useTheme();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [grade, setGrade] = useState(user?.grade || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
        Alert.alert('Error', 'Name and Email are required');
        return;
    }

    setLoading(true);
    try {
        const response = await updateProfile({ name, email, bio: grade /* mapping grade to bio for now if API doesn't have grade */ });
        // Refresh local user state ideally
        Alert.alert('Success', 'Profile updated successfully', [
            { text: 'OK', onPress: () => router.back() }
        ]);
        // Ideally call a refreshUser method from context here
    } catch (e) {
        Alert.alert('Error', 'Failed to update profile');
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Edit Profile</Text>
            <TouchableOpacity onPress={handleSave} disabled={loading}>
                {loading ? (
                    <ActivityIndicator size="small" color={Colors.primary} />
                ) : (
                    <Text style={{ color: Colors.primary, fontWeight: '700', fontSize: 16 }}>Save</Text>
                )}
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
               {/* Avatar Placeholder */}
               <View style={styles.avatarSection}>
                   <View style={[styles.avatarCircle, { backgroundColor: Colors.primary }]}>
                        <Text style={styles.avatarText}>{name?.[0]?.toUpperCase() || 'U'}</Text>
                   </View>
                   <TouchableOpacity>
                       <Text style={{ color: Colors.primary, fontWeight: '600', marginTop: 8 }}>Change Photo</Text>
                   </TouchableOpacity>
               </View>

               <View style={styles.form}>
                   <View style={styles.inputGroup}>
                       <Text style={[styles.label, { color: colors.textSecondary }]}>Full Name</Text>
                       <TextInput 
                            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter your name"
                            placeholderTextColor={colors.textTertiary}
                       />
                   </View>

                   <View style={styles.inputGroup}>
                       <Text style={[styles.label, { color: colors.textSecondary }]}>Email</Text>
                       <TextInput 
                            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            placeholderTextColor={colors.textTertiary}
                            keyboardType="email-address"
                            autoCapitalize="none"
                       />
                   </View>

                   <View style={styles.inputGroup}>
                       <Text style={[styles.label, { color: colors.textSecondary }]}>Grade / Class</Text>
                       <TextInput 
                            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                            value={grade}
                            onChangeText={setGrade}
                            placeholder="e.g. 10th Grade"
                            placeholderTextColor={colors.textTertiary}
                       />
                   </View>
               </View>
          </ScrollView>
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
  content: { padding: Spacing.lg },
  avatarSection: { alignItems: 'center', marginBottom: Spacing.xl },
  avatarCircle: {
      width: 100, height: 100, borderRadius: 50,
      justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 40, fontWeight: '700', color: '#fff' },
  form: { gap: Spacing.lg },
  inputGroup: { gap: 6 },
  label: { fontSize: 14, fontWeight: '600' },
  input: {
      paddingHorizontal: Spacing.md, paddingVertical: 12, borderRadius: BorderRadius.md,
      borderWidth: 1, fontSize: 16
  }
});
