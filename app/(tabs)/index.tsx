/**
 * Home Screen
 * 
 * Welcome screen with recipe statistics and quick action buttons
 * Main entry point after authentication
 */

import { IconSymbol } from '@/components/ui/icon-symbol';
import { LoadingSkeleton } from '@/src/components/LoadingSkeleton';
import { useAuth } from '@/src/contexts/AuthContext';
import { useRecipes } from '@/src/hooks/useRecipes';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { recipes, loading, refetch } = useRecipes();
  const { user, signOut } = useAuth();

  const stats = {
    total: recipes.length,
    recent: recipes.filter(
      (r) => new Date(r.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length,
  };

  const quickActions = [
    {
      icon: 'plus.circle.fill',
      label: 'Add Recipe',
      color: '#0ea5e9',
      onPress: () => router.push('/add-recipe'),
    },
    {
      icon: 'magnifyingglass',
      label: 'Search',
      color: '#8b5cf6',
      onPress: () => router.push('/(tabs)/search'),
    },
    {
      icon: 'list.bullet',
      label: 'All Recipes',
      color: '#f59e0b',
      onPress: () => router.push('/(tabs)/manage'),
    },
  ];

  if (loading) {
    return (
      <View style={styles.container}>
        <LoadingSkeleton count={4} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back!</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>
        <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
          <IconSymbol name="arrow.right.square" size={24} color="#ef4444" />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: '#e0f2fe' }]}>
          <IconSymbol name="book.closed.fill" size={32} color="#0284c7" />
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total Recipes</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: '#fef3c7' }]}>
          <IconSymbol name="clock.fill" size={32} color="#d97706" />
          <Text style={styles.statNumber}>{stats.recent}</Text>
          <Text style={styles.statLabel}>This Week</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionCard}
              onPress={action.onPress}
              activeOpacity={0.7}
            >
              <View
                style={[styles.actionIcon, { backgroundColor: `${action.color}20` }]}
              >
                <IconSymbol name={action.icon} size={28} color={action.color} />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Recipes */}
      {recipes.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Recipes</Text>
          {recipes.slice(0, 3).map((recipe) => (
            <TouchableOpacity
              key={recipe.id}
              style={styles.recipeItem}
              onPress={() => router.push(`/recipe/${recipe.id}`)}
            >
              <View style={styles.recipeIcon}>
                <IconSymbol name="fork.knife" size={20} color="#0ea5e9" />
              </View>
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeTitle} numberOfLines={1}>
                  {recipe.title}
                </Text>
                <Text style={styles.recipeDate}>
                  {new Date(recipe.created_at).toLocaleDateString()}
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color="#cbd5e1" />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  email: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  recipeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recipeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipeInfo: {
    flex: 1,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  recipeDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
