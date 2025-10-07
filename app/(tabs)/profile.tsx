import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Stack } from 'expo-router';
import {
  Heart,
  Clock,
  Settings,
  LogOut,
  FileText,
  MessageSquare,
  BarChart3,
  Share2,
  LogIn,
} from 'lucide-react-native';
import colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { testUsers } from '@/utils/testData';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  showArrow?: boolean;
}

function MenuItem({ icon, label, onPress, showArrow = true }: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuItemLeft}>
        <View>{icon}</View>
        <Text style={styles.menuItemText}>{label}</Text>
      </View>
      {showArrow && <Text style={styles.arrow}>›</Text>}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { user, logout, login } = useApp();

  const handleLogin = async () => {
    await login(testUsers.user);
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleMenuPress = (menu: string) => {
    console.log('Menu pressed:', menu);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Cá nhân',
            headerShown: true,
          }}
        />
        <View style={styles.emptyContainer}>
          <LogIn size={64} color={colors.textLight} />
          <Text style={styles.emptyTitle}>Chưa đăng nhập</Text>
          <Text style={styles.emptyDescription}>
            Đăng nhập để sử dụng đầy đủ tính năng
          </Text>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Đăng nhập / Đăng ký</Text>
          </TouchableOpacity>
          
          <View style={styles.devMenu}>
            <Text style={styles.devMenuTitle}>Test Users (Dev)</Text>
            <TouchableOpacity
              style={styles.devButton}
              onPress={() => login(testUsers.user)}
            >
              <Text style={styles.devButtonText}>Login as User</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.devButton}
              onPress={() => login(testUsers.broker)}
            >
              <Text style={styles.devButtonText}>Login as Broker</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.devButton}
              onPress={() => login(testUsers.brokerPending)}
            >
              <Text style={styles.devButtonText}>Login as Broker (Pending)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Cá nhân',
          headerShown: true,
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: user.avatar || 'https://i.pravatar.cc/150?img=1' }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          {user.role === 'broker' && (
            <View style={styles.brokerBadge}>
              <Text style={styles.brokerBadgeText}>Môi giới</Text>
            </View>
          )}
        </View>

        <View style={styles.menuSection}>
          {user.role === 'user' && (
            <>
              <MenuItem
                icon={<Heart size={20} color={colors.text} />}
                label="Tin đã lưu"
                onPress={() => handleMenuPress('favorites')}
              />
              <MenuItem
                icon={<Clock size={20} color={colors.text} />}
                label="Lịch sử xem"
                onPress={() => handleMenuPress('history')}
              />
              <MenuItem
                icon={<Settings size={20} color={colors.text} />}
                label="Cài đặt"
                onPress={() => handleMenuPress('settings')}
              />
            </>
          )}

          {user.role === 'broker' && (
            <>
              <MenuItem
                icon={<FileText size={20} color={colors.text} />}
                label="Tin của tôi"
                onPress={() => handleMenuPress('my-listings')}
              />
              <MenuItem
                icon={<MessageSquare size={20} color={colors.text} />}
                label="Lịch sử liên hệ"
                onPress={() => handleMenuPress('contact-history')}
              />
              <MenuItem
                icon={<BarChart3 size={20} color={colors.text} />}
                label="Thống kê"
                onPress={() => handleMenuPress('statistics')}
              />
              <MenuItem
                icon={<Share2 size={20} color={colors.text} />}
                label="Mạng xã hội"
                onPress={() => handleMenuPress('social-links')}
              />
              <MenuItem
                icon={<Settings size={20} color={colors.text} />}
                label="Cài đặt"
                onPress={() => handleMenuPress('settings')}
              />
            </>
          )}

          <MenuItem
            icon={<LogOut size={20} color={colors.error} />}
            label="Đăng xuất"
            onPress={handleLogout}
            showArrow={false}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundGray,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginTop: 20,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  emptyDescription: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 28,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  profileHeader: {
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: colors.primaryLighter,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  email: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  brokerBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  brokerBadgeText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  menuSection: {
    backgroundColor: colors.white,
    marginBottom: 16,
    borderRadius: 16,
    marginHorizontal: 16,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  arrow: {
    fontSize: 24,
    color: colors.textLight,
  },
  devMenu: {
    marginTop: 32,
    padding: 16,
    backgroundColor: colors.backgroundGray,
    borderRadius: 12,
    width: '100%',
  },
  devMenuTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  devButton: {
    backgroundColor: colors.white,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  devButtonText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
  },
});
