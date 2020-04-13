import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function SaveButton({ display, onClick, buttonText }) {
  function Press(click) {
    if (typeof click === 'function') {
      click();
    }
  }

  return display ? (
    <TouchableOpacity style={styles.confirmButtom} onPress={() => Press(onClick)}>
      <Text style={styles.confirmText}>{buttonText ? buttonText : "Salvar alterações"}</Text>
    </TouchableOpacity>
  ) : null;
}

const styles = StyleSheet.create({
  confirmButtom: {
    paddingVertical: 14,
    backgroundColor: '#00910a',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    zIndex: 9999,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    zIndex: 70
  },
  confirmText: {
    color: '#fff',
    fontSize: 16
  }
});
