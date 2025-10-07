import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { Eye, TrendingUp } from 'lucide-react-native';
import colors from '@/constants/colors';
import { mockNews } from '@/mocks/news';
import { formatDate, formatViews } from '@/utils/format';

const categories = ['Tất cả', 'Thị trường', 'Phân tích', 'Dự án', 'Chính sách'];

export default function NewsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  const handleNewsPress = (newsId: string) => {
    console.log('News pressed:', newsId);
  };

  const filteredNews = selectedCategory === 'Tất cả' 
    ? mockNews 
    : mockNews.filter(news => news.category === selectedCategory);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Tin tức BDS',
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.white,
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.text,
          },
        }}
      />

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.categoryChipActive
            ]}
            onPress={() => setSelectedCategory(category)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.categoryChipText,
              selectedCategory === category && styles.categoryChipTextActive
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredNews}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.newsCard}
            onPress={() => handleNewsPress(item.id)}
            activeOpacity={0.7}
          >
            <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} resizeMode="cover" />
            <View style={styles.content}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
              <Text style={styles.title} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>
              <View style={styles.footer}>
                <Text style={styles.date}>{formatDate(item.date)}</Text>
                <View style={styles.viewsContainer}>
                  <Eye size={14} color={colors.textLight} />
                  <Text style={styles.views}>{formatViews(item.views)}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundGray,
  },
  listContent: {
    padding: 16,
  },
  newsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    backgroundColor: colors.backgroundGray,
  },
  content: {
    padding: 18,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLighter,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 14,
    lineHeight: 21,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  date: {
    fontSize: 13,
    color: colors.textLight,
    fontWeight: '500',
  },
  viewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.backgroundGray,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  views: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  // Category styles
  categoryContainer: {
    backgroundColor: colors.white,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  categoryContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.backgroundGray,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  categoryChipTextActive: {
    color: colors.white,
  },
});
