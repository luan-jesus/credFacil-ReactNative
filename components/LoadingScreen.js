import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

export default function LoadingScreen({ loading }) {
  return (
    <>{loading ? <View style={styles.loadingScreen}><Text>Loading</Text></View> : null}</>
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
    justifyContent: 'center',
    alignItems: 'center',
    display: 'none'
  }
});
