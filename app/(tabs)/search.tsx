/**
 * Search Screen
 * 
 * Real-time recipe search by title or keywords
 * Displays results with debouncing for better performance
 */

import { EmptyState } from '@/src/components/EmptyState';
import { LoadingSkeleton } from '@/src/components/LoadingSkeleton';
import { RecipeCard } from '@/src/components/RecipeCard';
import { SearchBar } from '@/src/components/SearchBar';
import { useRecipeSearch } from '@/src/hooks/useRecipeSearch';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { results, loading, search } = useRecipeSearch();

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    search(text);
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingSkeleton count={5} />;
    }

    if (searchQuery && results.length === 0) {
      return (
        <EmptyState
          icon="magnifyingglass"
          title="No Results"
          message={`No recipes found for "${searchQuery}". Try different keywords.`}
        />
      );
    }

    if (!searchQuery) {
      return (
        <EmptyState
          icon="magnifyingglass"
          title="Search Recipes"
          message="Enter a recipe title or keyword to search your collection"
        />
      );
    }

    return (
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RecipeCard
            recipe={item}
            onPress={() => router.push(`/recipe/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.list}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder="Search by title or keywords..."
          autoFocus
        />
        {searchQuery && (
          <Text style={styles.resultCount}>
            {results.length} result{results.length !== 1 ? 's' : ''} found
          </Text>
        )}
      </View>
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  resultCount: {
    marginTop: 8,
    fontSize: 14,
    color: '#6b7280',
  },
  list: {
    padding: 16,
  },
});
