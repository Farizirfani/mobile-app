import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, colors, isDark } = useTheme();
  const router = useRouter();

  const menuItems = [
    { icon: 'person-outline' as const, label: 'Edit Profile', action: () => router.push('/profile/edit') },
    { icon: 'notifications-outline' as const, label: 'Notifications', action: () => {} },
    { icon: 'bookmark-outline' as const, label: 'Bookmarks', action: () => router.push('/my-stuff/bookmarks') },
    { icon: 'shield-checkmark-outline' as const, label: 'Privacy', action: () => {} },
    { icon: 'help-circle-outline' as const, label: 'Help & Support', action: () => {} },
    { icon: 'information-circle-outline' as const, label: 'About', action: () => {} },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Text style={[styles.pageTitle, { color: colors.text }]}>Profile</Text>

        {/* Avatar Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }]}>
          <View style={[styles.avatarCircle, { backgroundColor: Colors.primary }]}>
            <Text style={styles.avatarText}>{user?.name?.[0] || 'S'}</Text>
          </View>
          <Text style={[styles.userName, { color: colors.text }]}>{user?.name || 'Student'}</Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user?.email || 'email@example.com'}</Text>
          <View style={[styles.gradeBadge, { backgroundColor: isDark ? '#1e293b' : '#EEF2FF' }]}>
            <Text style={{ color: Colors.primary, fontWeight: '600', fontSize: 13 }}>
              Grade {user?.grade || '12'} • {user?.role || 'Student'}
            </Text>
          </View>
        </View>

        {/* Theme Toggles */}
        <View style={[styles.menuCard, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }]}>
             <View style={styles.menuItem}>
                 <View style={[styles.menuIconBg, { backgroundColor: colors.surfaceSecondary }]}>
                     <Ionicons name="moon-outline" size={20} color={colors.textSecondary} />
                 </View>
                 <Text style={[styles.menuLabel, { color: colors.text }]}>Dark Mode</Text>
                 <Switch 
                    value={isDark} 
                    onValueChange={toggleTheme} 
                    trackColor={{ false: '#767577', true: Colors.primary }}
                    thumbColor={isDark ? '#fff' : '#f4f3f4'}
                />
             </View>
        </View>

        {/* Menu Items */}
        <View style={[styles.menuCard, { backgroundColor: colors.surface, shadowColor: colors.cardShadow }]}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuItem,
                index < menuItems.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
              ]}
              onPress={item.action}
              activeOpacity={0.6}
            >
              <View style={[styles.menuIconBg, { backgroundColor: colors.surfaceSecondary }]}>
                <Ionicons name={item.icon} size={20} color={colors.textSecondary} />
              </View>
              <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: isDark ? '#331e1e' : '#FEF2F2', borderColor: isDark ? '#7f1d1d' : '#FECACA' }]}
          onPress={logout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Keluar</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.md },
  pageTitle: { fontSize: 26, fontWeight: '800', marginBottom: Spacing.xl },
  profileCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xxl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarCircle: {
    width: 80, height: 80, borderRadius: 40,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 32 },
  userName: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  userEmail: { fontSize: 14, marginBottom: Spacing.md },
  gradeBadge: {
    paddingHorizontal: 16, paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  menuCard: {
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  menuIconBg: {
    width: 36, height: 36, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '500' },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: 16,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  logoutText: { color: '#EF4444', fontSize: 16, fontWeight: '600' },
});
