import React from 'react';
import {TextInput} from 'react-native';
import {
  Text,
  StyleSheet,
  View,
} from 'react-native';

import Header from '../components/Header'
import { ScrollView } from 'react-native-gesture-handler';

export default function Customers({ navigation }) {
  return (
    <>
      <Header navigation={navigation} name='Clientes'/>
      <View style={styles.filter}>
        <TextInput style={styles.textFilter} placeholder='Cliente'></TextInput>
      </View>
      <ScrollView style={styles.CustomerList}>
        <View style={styles.itemList}>
          <Text>Magazine Luiza</Text>
        </View>
      </ScrollView>
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  filter: {
    backgroundColor: '#ececec',
    paddingHorizontal: 5,
    paddingVertical: 10
  },
  textFilter: {
    fontSize: 22,
  },
  CustomerList: {
    marginTop: 10
  },
  itemList: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 5
  }
});
