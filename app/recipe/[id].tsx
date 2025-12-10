/**
 * Recipe Detail Screen
 * 
 * Displays full recipe information with edit and delete options
 * Supports pull-to-refresh to update data
 */

import { IconSymbol } from '@/components/ui/icon-symbol';
import { ConfirmDialog } from '@/src/components/ConfirmDialog';
import { EmptyState } from '@/src/components/EmptyState';
import { useDeleteRecipe } from '@/src/hooks/useDeleteRecipe';
import { useRecipeById } from '@/src/hooks/useRecipeById';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function RecipeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { recipe, loading, error, refetch } = useRecipeById(id);
  const { deleteRecipe, loading: deleting } = useDeleteRecipe();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    if (recipe) {
      const success = await deleteRecipe(recipe.id);
      if (success) {
        router.back();
      }
    }
    setShowDeleteDialog(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const parseSteps = (stepsText: string): string[] => {
    return stepsText
      .split('\n')
      .map((step) => step.trim())
      .filter((step) => step.length > 0);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  if (error || !recipe) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="exclamationmark.triangle"
          title="Recipe Not Found"
          message="This recipe may have been deleted or you don't have permission to view it"
          actionLabel="Go Back"
          onAction={() => router.back()}
        />
      </View>
    );
  }

  const steps = parseSteps(recipe.steps);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{recipe.title}</Text>
          <Text style={styles.date}>{formatDate(recipe.created_at)}</Text>
        </View>

        {/* Keywords */}
        {recipe.keywords && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="tag.fill" size={20} color="#0ea5e9" />
              <Text style={styles.sectionTitle}>Keywords</Text>
            </View>
            <View style={styles.keywordsContainer}>
              {recipe.keywords.split(',').map((keyword, index) => (
                <View key={index} style={styles.keywordBadge}>
                  <Text style={styles.keywordText}>{keyword.trim()}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Steps */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="list.bullet" size={20} color="#0ea5e9" />
            <Text style={styles.sectionTitle}>Steps</Text>
          </View>
          <View style={styles.stepsContainer}>
            {steps.map((step, index) => (
              <View key={index} style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.deleteButton]}
            onPress={() => setShowDeleteDialog(true)}
            disabled={deleting}
          >
            <IconSymbol name="trash" size={20} color="#fff" />
            <Text style={styles.deleteButtonText}>Delete Recipe</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={showDeleteDialog}
        title="Delete Recipe"
        message={`Are you sure you want to delete "${recipe.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
        destructive
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  keywordBadge: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  keywordText: {
    color: '#0284c7',
    fontSize: 14,
    fontWeight: '500',
  },
  stepsContainer: {
    gap: 16,
  },
  stepItem: {
    flexDirection: 'row',
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0ea5e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
