import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator
} from 'react-native';

export default function LoadingScreen({ loading }) {
  return (
    <>{loading ? <View style={styles.loadingScreen}><ActivityIndicator size={54} color="#ff9538" /></View> : null}</>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    position: 'absolute',
    zIndex: 99,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'none'
  }
});
