/**
 * Manage Recipes Screen (Delete Recipes)
 * 
 * List all user recipes with swipe-to-delete functionality
 * Includes confirmation dialog before deletion
 */

import { ConfirmDialog } from '@/src/components/ConfirmDialog';
import { EmptyState } from '@/src/components/EmptyState';
import { LoadingSkeleton } from '@/src/components/LoadingSkeleton';
import { RecipeCard } from '@/src/components/RecipeCard';
import { useDeleteRecipe } from '@/src/hooks/useDeleteRecipe';
import { useRecipes } from '@/src/hooks/useRecipes';
import { Recipe } from '@/src/types/recipe';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

export default function ManageRecipesScreen() {
  const router = useRouter();
  const { recipes, loading, refetch } = useRecipes();
  const { deleteRecipe, loading: deleting } = useDeleteRecipe();
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);

  const handleDelete = async () => {
    if (recipeToDelete) {
      const success = await deleteRecipe(recipeToDelete.id);
      if (success) {
        refetch();
      }
      setRecipeToDelete(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <LoadingSkeleton count={5} />
      </View>
    );
  }

  if (recipes.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="book.closed"
          title="No Recipes Yet"
          message="Start building your recipe collection by adding your first recipe"
          actionLabel="Add Recipe"
          onAction={() => router.push('/add-recipe')}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SwipeableRecipeCard
            recipe={item}
            onPress={() => router.push(`/recipe/${item.id}`)}
            onDelete={() => setRecipeToDelete(item)}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
      />

      <ConfirmDialog
        visible={recipeToDelete !== null}
        title="Delete Recipe"
        message={`Are you sure you want to delete "${recipeToDelete?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setRecipeToDelete(null)}
        destructive
      />
    </View>
  );
}

interface SwipeableRecipeCardProps {
  recipe: Recipe;
  onPress: () => void;
  onDelete: () => void;
}

function SwipeableRecipeCard({ recipe, onPress, onDelete }: SwipeableRecipeCardProps) {
  const translateX = useSharedValue(0);
  const SWIPE_THRESHOLD = -80;

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationX < 0) {
        translateX.value = event.translationX;
      }
    })
    .onEnd(() => {
      if (translateX.value < SWIPE_THRESHOLD) {
        translateX.value = withTiming(-100);
        runOnJS(onDelete)();
      } else {
        translateX.value = withTiming(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.swipeContainer}>
      <View style={styles.deleteBackground}>
        <Text style={styles.deleteText}>Delete</Text>
      </View>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={animatedStyle}>
          <RecipeCard recipe={recipe} onPress={onPress} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  list: {
    padding: 16,
  },
  swipeContainer: {
    position: 'relative',
  },
  deleteBackground: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 100,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 12,
  },
  deleteText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
