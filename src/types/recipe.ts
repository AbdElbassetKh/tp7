/**
 * Recipe Type Definitions
 * 
 * Core types for the Recipe entity used throughout the application
 */

/**
 * Recipe interface matching the database schema
 */
export interface Recipe {
  id: string;
  title: string;
  steps: string;
  keywords: string | null;
  created_at: string;
  user_id: string;
}

/**
 * Type for creating a new recipe (without auto-generated fields)
 */
export type RecipeInsert = Omit<Recipe, 'id' | 'created_at' | 'user_id'>;

/**
 * Type for updating a recipe (all fields optional except id)
 */
export type RecipeUpdate = Partial<Omit<Recipe, 'id' | 'created_at' | 'user_id'>> & {
  id: string;
};

/**
 * Recipe with formatted date for display
 */
export interface RecipeWithFormatted extends Recipe {
  formattedDate: string;
  stepsList: string[];
}
