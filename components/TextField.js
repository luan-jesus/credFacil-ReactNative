import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function TextField({ label, value, onChange, editable }) {

  return (
    <View style={styles.field}>
      <Text style={styles.title}>{label}</Text>
      <TextInput
        style={[styles.textField, {backgroundColor: editable ? '#fff' : '#f5f5f5'}]}
        value={value}
        onChangeText={text => onChange(text)}
        editable={editable}
      ></TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'column',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 16,
    marginBottom: 5
  },
  textField: {
    backgroundColor: '#fff',
    fontSize: 15,
    textAlign: 'left',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5
  },
});
