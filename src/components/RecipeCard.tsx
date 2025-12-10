/**
 * RecipeCard Component
 * 
 * Displays recipe information in a card format
 * Touchable for navigation to detail view
 */

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Recipe } from '@/src/types/recipe';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RecipeCardProps {
  recipe: Recipe;
  onPress: () => void;
}

export function RecipeCard({ recipe, onPress }: RecipeCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStepsPreview = (steps: string) => {
    const lines = steps.split('\n').filter(line => line.trim());
    return lines.length > 0 ? `${lines.length} step${lines.length !== 1 ? 's' : ''}` : 'No steps';
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {recipe.title}
        </Text>
        <IconSymbol name="chevron.right" size={20} color="#0ea5e9" />
      </View>

      <View style={styles.meta}>
        <View style={styles.metaItem}>
          <IconSymbol name="list.bullet" size={16} color="#666" />
          <Text style={styles.metaText}>{getStepsPreview(recipe.steps)}</Text>
        </View>

        {recipe.keywords && (
          <View style={styles.metaItem}>
            <IconSymbol name="tag" size={16} color="#666" />
            <Text style={styles.metaText} numberOfLines={1}>
              {recipe.keywords}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.date}>{formatDate(recipe.created_at)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
    marginRight: 8,
  },
  meta: {
    gap: 8,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 8,
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
});
