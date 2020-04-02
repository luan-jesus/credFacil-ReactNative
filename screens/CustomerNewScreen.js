import React from 'react';
import { TextInput } from 'react-native';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import Header from '../components/Header';

export default function CustomerNewScreen({ navigation }) {

  return (
    <>
      <Header navigation={navigation} name='Clientes' rightButton='ios-checkmark-circle-outline' />
      <ScrollView style={styles.container}>
        <View style={styles.field}>
          <Text>Nome do Cliente:</Text>
          <TextInput style={styles.textField} ></TextInput>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 15
  },
  field: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    marginHorizontal: 20,
  },
  textField: {
    backgroundColor: '#f5f5f5',
    width: 140,
    textAlign: 'right',
  }
});
