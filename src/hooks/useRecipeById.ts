/**
 * useRecipeById Hook
 * 
 * Fetches a single recipe by ID
 * Ensures the recipe belongs to the current user
 */

import { useAuth } from '@/src/contexts/AuthContext';
import { supabase } from '@/src/lib/supabase';
import { Recipe } from '@/src/types/recipe';
import { useEffect, useState } from 'react';

interface UseRecipeByIdReturn {
  recipe: Recipe | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useRecipeById(id: string | undefined): UseRecipeByIdReturn {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchRecipe = async () => {
    if (!user || !id) {
      setRecipe(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      setRecipe(data);
    } catch (err: any) {
      console.error('Error fetching recipe:', err);
      setError(err.message || 'Failed to fetch recipe');
      setRecipe(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [id, user]);

  return {
    recipe,
    loading,
    error,
    refetch: fetchRecipe,
  };
}
