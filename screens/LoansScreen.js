import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import Header from '../components/Header';
import LoadingScreen from '../components/LoadingScreen';
import LoanItem from '../components/LoanItem'
import api from '../services/api';


export default function Loans({ navigation }) {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      await api.get('/emprestimos')
        .then(response => setLoans(...loans, response.data))
        .catch(error => alert(error.message));
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <>
      <Header navigation={navigation} name="Emprestimos" rightButton='md-add' rightClick={() => navigation.navigate('CustomerNewScreen')}/>
      <LoadingScreen loading={loading}/>
      <View style={styles.filter}>
        <TextInput style={styles.textFilter} placeholder="Cliente"></TextInput>
      </View>
      <ScrollView style={styles.CustomerList}>
         {loans.map(loan => (
            <LoanItem emprestimo={loan} key={Math.random()}/>
          ))}
      </ScrollView>
    </>
  );
}

function ItemList({ name, customerId, navigation }) {
  return (
    <TouchableOpacity style={styles.itemList} onPress={() => navigation.navigate('CustomerDetailScreen', { customerId: customerId })}  >
      <Text style={styles.itemName}>{name}</Text>
      <Ionicons name="ios-arrow-round-forward" size={22} />
    </TouchableOpacity>
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
    fontSize: 22
  },
  CustomerList: {
    marginTop: 10
  },
  itemList: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#adadad',
    marginBottom: 10,
    marginHorizontal: 5,
    justifyContent: 'space-between'
  },
  itemName: {
    fontSize: 16
  }
});
