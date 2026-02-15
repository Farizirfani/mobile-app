import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const menuItems = [
    { icon: 'person-outline' as const, label: 'Edit Profile', action: () => {} },
    { icon: 'notifications-outline' as const, label: 'Notifications', action: () => {} },
    { icon: 'bookmark-outline' as const, label: 'Bookmarks', action: () => {} },
    { icon: 'shield-checkmark-outline' as const, label: 'Privacy', action: () => {} },
    { icon: 'help-circle-outline' as const, label: 'Help & Support', action: () => {} },
    { icon: 'information-circle-outline' as const, label: 'About', action: () => {} },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Text style={[styles.pageTitle, { color: theme.text }]}>Profile</Text>

        {/* Avatar Card */}
        <View style={[styles.profileCard, { backgroundColor: theme.surface, shadowColor: theme.cardShadow }]}>
          <View style={[styles.avatarCircle, { backgroundColor: Colors.primary }]}>
            <Text style={styles.avatarText}>{user?.name?.[0] || 'S'}</Text>
          </View>
          <Text style={[styles.userName, { color: theme.text }]}>{user?.name || 'Student'}</Text>
          <Text style={[styles.userEmail, { color: theme.textSecondary }]}>{user?.email || 'email@example.com'}</Text>
          <View style={[styles.gradeBadge, { backgroundColor: '#EEF2FF' }]}>
            <Text style={{ color: Colors.primary, fontWeight: '600', fontSize: 13 }}>
              Grade {user?.grade || '12'} • {user?.role || 'Student'}
            </Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={[styles.menuCard, { backgroundColor: theme.surface, shadowColor: theme.cardShadow }]}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuItem,
                index < menuItems.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border },
              ]}
              onPress={item.action}
              activeOpacity={0.6}
            >
              <View style={[styles.menuIconBg, { backgroundColor: theme.surfaceSecondary }]}>
                <Ionicons name={item.icon} size={20} color={theme.textSecondary} />
              </View>
              <Text style={[styles.menuLabel, { color: theme.text }]}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={theme.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}
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
