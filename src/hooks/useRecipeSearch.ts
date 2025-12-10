/**
 * useRecipeSearch Hook
 * 
 * Searches recipes by title or keywords with debouncing
 * Provides real-time search functionality
 */

import { useAuth } from '@/src/contexts/AuthContext';
import { supabase } from '@/src/lib/supabase';
import { Recipe } from '@/src/types/recipe';
import { useCallback, useEffect, useState } from 'react';

interface UseRecipeSearchReturn {
  results: Recipe[];
  loading: boolean;
  error: string | null;
  search: (query: string) => void;
}

export function useRecipeSearch(): UseRecipeSearchReturn {
  const [results, setResults] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const { user } = useAuth();

  // Debounced search function
  useEffect(() => {
    if (!user) {
      setResults([]);
      return;
    }

    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const delaySearch = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);

        const searchTerm = `%${query.trim()}%`;

        const { data, error: searchError } = await supabase
          .from('recipes')
          .select('*')
          .eq('user_id', user.id)
          .or(`title.ilike.${searchTerm},keywords.ilike.${searchTerm}`)
          .order('created_at', { ascending: false });

        if (searchError) {
          throw searchError;
        }

        setResults(data || []);
      } catch (err: any) {
        console.error('Error searching recipes:', err);
        setError(err.message || 'Failed to search recipes');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delaySearch);
  }, [query, user]);

  const search = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
  }, []);

  return {
    results,
    loading,
    error,
    search,
  };
}
