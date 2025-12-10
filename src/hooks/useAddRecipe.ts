/**
 * useAddRecipe Hook
 * 
 * Handles creating new recipes with validation
 * Returns the created recipe on success
 */

import { useAuth } from '@/src/contexts/AuthContext';
import { supabase } from '@/src/lib/supabase';
import { Recipe, RecipeInsert } from '@/src/types/recipe';
import { useState } from 'react';
import Toast from 'react-native-toast-message';

interface UseAddRecipeReturn {
  addRecipe: (recipe: RecipeInsert) => Promise<Recipe | null>;
  loading: boolean;
  error: string | null;
}

export function useAddRecipe(): UseAddRecipeReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const addRecipe = async (recipe: RecipeInsert): Promise<Recipe | null> => {
    if (!user) {
      const errorMsg = 'You must be logged in to add recipes';
      setError(errorMsg);
      Toast.show({
        type: 'error',
        text1: 'Authentication Required',
        text2: errorMsg,
      });
      return null;
    }

    // Validation
    if (!recipe.title || recipe.title.trim().length === 0) {
      const errorMsg = 'Recipe title is required';
      setError(errorMsg);
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: errorMsg,
      });
      return null;
    }

    if (recipe.title.length > 30) {
      const errorMsg = 'Recipe title must be 30 characters or less';
      setError(errorMsg);
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: errorMsg,
      });
      return null;
    }

    if (!recipe.steps || recipe.steps.trim().length === 0) {
      const errorMsg = 'Recipe steps are required';
      setError(errorMsg);
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: errorMsg,
      });
      return null;
    }

    if (recipe.keywords && recipe.keywords.length > 30) {
      const errorMsg = 'Keywords must be 30 characters or less';
      setError(errorMsg);
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: errorMsg,
      });
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: insertError } = await supabase
        .from('recipes')
        .insert([
          {
            ...recipe,
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      Toast.show({
        type: 'success',
        text1: 'Recipe Added',
        text2: `"${recipe.title}" has been created successfully`,
      });

      return data;
    } catch (err: any) {
      console.error('Error adding recipe:', err);
      const errorMsg = err.message || 'Failed to add recipe';
      setError(errorMsg);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMsg,
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    addRecipe,
    loading,
    error,
  };
}
