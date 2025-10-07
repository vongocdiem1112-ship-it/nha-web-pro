import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Platform,
  Animated,
} from 'react-native';
import { Stack } from 'expo-router';
import { Search, Bell } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '@/constants/colors';
import { mockListings, PropertyType } from '@/mocks/listings';
import PropertyCard from '@/components/PropertyCard';
import PropertyCardSkeleton from '@/components/PropertyCardSkeleton';
import Toast from '@/components/Toast';
import { useApp } from '@/contexts/AppContext';
import * as Haptics from 'expo-haptics';

const FILTER_OPTIONS: { label: string; value: PropertyType | 'Tất cả' }[] = [
  { label: 'Tất cả', value: 'Tất cả' },
  { label: 'Nhà', value: 'Nhà' },
  { label: 'Đất', value: 'Đất' },
  { label: 'Chung cư', value: 'Chung cư' },
  { label: 'Cho thuê', value: 'Cho thuê' },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { toggleFavorite, isFavorite, user } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<PropertyType | 'Tất cả'>('Tất cả');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{visible: boolean; message: string; type?: 'success' | 'error' | 'info'}>({
    visible: false,
    message: '',
  });

  const filteredListings = useMemo(() => {
    if (selectedFilter === 'Tất cả') {
      return mockListings;
    }
    return mockListings.filter((listing) => listing.type === selectedFilter);
  }, [selectedFilter]);

  const handleFilterPress = (filter: PropertyType | 'Tất cả') => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedFilter(filter);
  };

  const handleFavoritePress = async (listingId: string) => {
    if (!user) {
      setToast({
        visible: true,
        message: 'Vui lòng đăng nhập để thêm yêu thích',
        type: 'info'
      });
      return;
    }
    
    try {
      await toggleFavorite(listingId);
      const isCurrentlyFavorite = isFavorite(listingId);
      setToast({
        visible: true,
        message: isCurrentlyFavorite ? 'Đã xóa khỏi yêu thích' : 'Đã thêm vào yêu thích',
        type: 'success'
      });
    } catch (error) {
      setToast({
        visible: true,
        message: 'Có lỗi xảy ra, vui lòng thử lại',
        type: 'error'
      });
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
      setToast({
        visible: true,
        message: 'Đã cập nhật danh sách mới nhất',
        type: 'success'
      });
    }, 1500);
  };

  const handleSearchPress = () => {
    // TODO: Navigate to search screen
    console.log('Search pressed');
  };

  const handleListingPress = (listingId: string) => {
    // TODO: Navigate to listing detail
    console.log('Listing pressed:', listingId);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerTop}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>🏠</Text>
            <Text style={styles.logoText}>VungTauLand</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton} activeOpacity={0.7}>
            <Bell size={20} color={colors.textSecondary} strokeWidth={2} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.greeting}>
          Xin chào{user ? `, ${user.name || 'bạn'}` : ''}! 👋
        </Text>
        <Text style={styles.subGreeting}>
          Hãy tìm căn nhà mơ ước của bạn
        </Text>
        
        <TouchableOpacity style={styles.searchBar} onPress={handleSearchPress} activeOpacity={0.8}>
          <Search size={20} color={colors.textLight} strokeWidth={2} />
          <Text style={styles.searchPlaceholder}>Tìm kiếm bất động sản...</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {FILTER_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[styles.filterChip, selectedFilter === option.value && styles.filterChipActive]}
            onPress={() => handleFilterPress(option.value)}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.filterText, selectedFilter === option.value && styles.filterTextActive]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredListings}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <PropertyCard
              listing={item}
              onPress={() => handleListingPress(item.id)}
              onFavoritePress={() => handleFavoritePress(item.id)}
              isFavorite={isFavorite(item.id)}
            />
          </View>
        )}
      />

      {/* Toast Notification */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ ...toast, visible: false })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundGray,
  },
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingBottom: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    marginBottom: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    fontSize: 24,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  notificationButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
    backgroundColor: colors.backgroundGray,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundGray,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 15,
    gap: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  searchPlaceholder: {
    fontSize: 15,
    color: colors.textLight,
    flex: 1,
    fontWeight: '500',
  },
  filterContainer: {
    backgroundColor: colors.white,
    paddingVertical: 4,
  },
  filterContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  filterTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: '48%',
  },
});
