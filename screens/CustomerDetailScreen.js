import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import Header from '../components/Header';
import LoadingScreen from '../components/LoadingScreen';


export default function CustomerDetailScreen({ navigation, route }) {
  const [customer, setCustomer] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      let customers = await fetch('http://192.168.0.2:5000/clientes/' + route.params?.customerId);
      let data = await customers.json();
      setCustomer(data[0]);
      setLoading(false);
    }
    loadData();
  }, [customer]);

  return (
    <>
      <Header navigation={navigation} name='Clientes' rightButton='ios-create' />
      <LoadingScreen loading={loading}/>
      <ScrollView style={styles.container}>
        <View style={styles.field}>
          <Text>Id do Cliente:</Text>
          <TextInput style={styles.textField} value={customer.id} editable={false}></TextInput>
        </View>
        <View style={styles.field}>
          <Text>Nome do Cliente:</Text>
          <TextInput style={styles.textField} value={customer.name} editable={false}></TextInput>
        </View>
        <View style={styles.field}>
          <Text>Parcelas atrasadas:</Text>
          <TextInput style={styles.textField} value='0' editable={false}></TextInput>
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
