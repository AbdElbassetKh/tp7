/**
 * useDeleteRecipe Hook
 * 
 * Handles deleting recipes with confirmation
 * Provides optimistic UI updates
 */

import { useAuth } from '@/src/contexts/AuthContext';
import { supabase } from '@/src/lib/supabase';
import { useState } from 'react';
import Toast from 'react-native-toast-message';

interface UseDeleteRecipeReturn {
  deleteRecipe: (id: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export function useDeleteRecipe(): UseDeleteRecipeReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const deleteRecipe = async (id: string): Promise<boolean> => {
    if (!user) {
      const errorMsg = 'You must be logged in to delete recipes';
      setError(errorMsg);
      Toast.show({
        type: 'error',
        text1: 'Authentication Required',
        text2: errorMsg,
      });
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) {
        throw deleteError;
      }

      Toast.show({
        type: 'success',
        text1: 'Recipe Deleted',
        text2: 'Recipe has been removed successfully',
      });

      return true;
    } catch (err: any) {
      console.error('Error deleting recipe:', err);
      const errorMsg = err.message || 'Failed to delete recipe';
      setError(errorMsg);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMsg,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteRecipe,
    loading,
    error,
  };
}
