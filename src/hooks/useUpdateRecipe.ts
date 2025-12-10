/**
 * useUpdateRecipe Hook
 * 
 * Handles updating existing recipes with validation
 */

import { useAuth } from '@/src/contexts/AuthContext';
import { supabase } from '@/src/lib/supabase';
import { Recipe, RecipeUpdate } from '@/src/types/recipe';
import { useState } from 'react';
import Toast from 'react-native-toast-message';

interface UseUpdateRecipeReturn {
  updateRecipe: (id: string, updates: Partial<RecipeUpdate>) => Promise<Recipe | null>;
  loading: boolean;
  error: string | null;
}

export function useUpdateRecipe(): UseUpdateRecipeReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const updateRecipe = async (
    id: string,
    updates: Partial<RecipeUpdate>
  ): Promise<Recipe | null> => {
    if (!user) {
      const errorMsg = 'You must be logged in to update recipes';
      setError(errorMsg);
      Toast.show({
        type: 'error',
        text1: 'Authentication Required',
        text2: errorMsg,
      });
      return null;
    }

    // Validation
    if (updates.title !== undefined && updates.title.length > 30) {
      const errorMsg = 'Recipe title must be 30 characters or less';
      setError(errorMsg);
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: errorMsg,
      });
      return null;
    }

    if (updates.keywords !== undefined && updates.keywords && updates.keywords.length > 30) {
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

      const { data, error: updateError } = await supabase
        .from('recipes')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      Toast.show({
        type: 'success',
        text1: 'Recipe Updated',
        text2: 'Changes have been saved successfully',
      });

      return data;
    } catch (err: any) {
      console.error('Error updating recipe:', err);
      const errorMsg = err.message || 'Failed to update recipe';
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
    updateRecipe,
    loading,
    error,
  };
}
