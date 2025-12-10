/**
 * LoadingSkeleton Component
 * 
 * Shows loading placeholder while data is being fetched
 * Provides better UX than spinner alone
 */

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface LoadingSkeletonProps {
  count?: number;
}

export function LoadingSkeleton({ count = 3 }: LoadingSkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <Animated.View key={index} style={[styles.card, { opacity }]}>
          <View style={styles.titleBar} />
          <View style={styles.line} />
          <View style={[styles.line, styles.lineShort]} />
          <View style={styles.footer} />
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
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
  titleBar: {
    height: 24,
    backgroundColor: '#e5e5e5',
    borderRadius: 4,
    marginBottom: 12,
  },
  line: {
    height: 14,
    backgroundColor: '#e5e5e5',
    borderRadius: 4,
    marginBottom: 8,
  },
  lineShort: {
    width: '60%',
  },
  footer: {
    height: 12,
    width: '40%',
    backgroundColor: '#e5e5e5',
    borderRadius: 4,
    marginTop: 8,
  },
});
