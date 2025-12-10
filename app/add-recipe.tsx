/**
 * Add Recipe Screen
 * 
 * Form for creating new recipes with validation
 * Enforces character limits and provides feedback
 */

import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAddRecipe } from '@/src/hooks/useAddRecipe';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const MAX_TITLE_LENGTH = 30;
const MAX_KEYWORDS_LENGTH = 30;

export default function AddRecipeScreen() {
  const router = useRouter();
  const { addRecipe, loading } = useAddRecipe();

  const [title, setTitle] = useState('');
  const [steps, setSteps] = useState('');
  const [keywords, setKeywords] = useState('');

  const handleSubmit = async () => {
    const newRecipe = await addRecipe({
      title: title.trim(),
      steps: steps.trim(),
      keywords: keywords.trim() || null,
    });

    if (newRecipe) {
      // Navigate to the newly created recipe
      router.replace(`/recipe/${newRecipe.id}`);
    }
  };

  const isValid = title.trim().length > 0 && steps.trim().length > 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          {/* Title Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Recipe Title <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g., Chocolate Chip Cookies"
              maxLength={MAX_TITLE_LENGTH}
              editable={!loading}
            />
            <Text style={styles.charCount}>
              {title.length}/{MAX_TITLE_LENGTH}
            </Text>
          </View>

          {/* Steps Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Recipe Steps <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.hint}>
              Enter each step on a new line for better formatting
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={steps}
              onChangeText={setSteps}
              placeholder={
                '1. Preheat oven to 350°F\n2. Mix dry ingredients\n3. Add wet ingredients\n4. Bake for 12 minutes'
              }
              multiline
              numberOfLines={8}
              textAlignVertical="top"
              editable={!loading}
            />
          </View>

          {/* Keywords Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Keywords (Optional)</Text>
            <Text style={styles.hint}>
              Add searchable keywords (e.g., dessert, quick, vegan)
            </Text>
            <TextInput
              style={styles.input}
              value={keywords}
              onChangeText={setKeywords}
              placeholder="e.g., dessert, cookies, baking"
              maxLength={MAX_KEYWORDS_LENGTH}
              editable={!loading}
            />
            <Text style={styles.charCount}>
              {keywords.length}/{MAX_KEYWORDS_LENGTH}
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, (!isValid || loading) && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!isValid || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <IconSymbol name="checkmark.circle.fill" size={24} color="#fff" />
                <Text style={styles.submitButtonText}>Create Recipe</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  required: {
    color: '#ef4444',
  },
  hint: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    color: '#1f2937',
  },
  textArea: {
    minHeight: 120,
    paddingTop: 12,
  },
  charCount: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#cbd5e1',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: 12,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
});
