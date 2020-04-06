import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Axios from 'axios';

import Header from '../../components/Header';
import LoadingScreen from '../../components/LoadingScreen';
import api from '../../services/api';

const CancelToken = Axios.CancelToken;
let cancel;

export default function Customers({ navigation }) {
  const [customer, setCustomer] = useState([]);
  const [customerContacts, setCustomerContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  function updateSearch(text) {
    var filtered = customer.filter((contact) => {
      return contact.name.toLowerCase().indexOf(text.toLowerCase()) !== -1;
    });

    setCustomerContacts(filtered);
  }
  useEffect(() => {
    async function loadData() {
      await api
        .get('/clientes', {
          cancelToken: new CancelToken(function executor(c) {
            // An executor function receives a cancel function as a parameter
            cancel = c;
          }),
        })
        .then((response) => setCustomer(...customer, response.data))
        .catch((error) => {
          if (Axios.isCancel(error)) {
            console.log('Request canceled', error.message);
          } else {
            alert(error.message);
          }
        });
      setLoading(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    setCustomerContacts(customer);
  }, [customer]);

  return (
    <>
      <Header
        leftClick={() => {cancel()}}
        navigation={navigation}
        name="Clientes"
        rightButton="md-add"
        rightClick={() => navigation.navigate('CustomerNewScreen')}
      />
      <LoadingScreen loading={loading} />
      <View style={styles.filter}>
        <TextInput
          style={styles.textFilter}
          placeholder="Cliente"
          onChangeText={(text) => updateSearch(text)}
        ></TextInput>
      </View>
      <ScrollView style={styles.CustomerList}>
        {customerContacts.map((val) => {
          return (
            <ItemList
              key={val.id}
              name={val.name}
              customerId={val.id}
              navigation={navigation}
            />
          );
        })}
      </ScrollView>
    </>
  );
}

function ItemList({ name, customerId, navigation }) {
  return (
    <TouchableOpacity
      style={styles.itemList}
      onPress={() =>
        navigation.navigate('CustomerDetailScreen', { customerId: customerId })
      }
    >
      <Text style={styles.itemName}>{name}</Text>
      <Ionicons name="ios-arrow-round-forward" size={22} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  filter: {
    backgroundColor: '#ececec',
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  textFilter: {
    fontSize: 22,
  },
  CustomerList: {
    marginTop: 10,
  },
  itemList: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#adadad',
    marginBottom: 10,
    marginHorizontal: 5,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
  },
});
