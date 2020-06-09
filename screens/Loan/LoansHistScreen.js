import React, { useState, useEffect } from 'react';
import { TextInput } from 'react-native';
import { Text, StyleSheet, View, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Axios from 'axios';

import Header from '../../components/Header';
import LoadingScreen from '../../components/LoadingScreen';
import LoanItem from '../../components/LoanItem';
import api from '../../services/api';

const CancelToken = Axios.CancelToken;
let cancel;

export default function Loans({ navigation }) {
  const [loans, setLoans] = useState([]);
  const [filteredLoans, seFilteredtLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  function updateSearch(text) {
    var filtered = loans.filter((loan) => {
      return loan?.cliente?.name?.toLowerCase().indexOf(text.toLowerCase()) !== -1;
    });

    seFilteredtLoans(filtered);
  }
  
  useEffect(() => {
    seFilteredtLoans(loans);
  }, [loans]);

  useEffect(() => {
    async function loadData() {
      await api
        .get('/emprestimos/historico', {
          cancelToken: new CancelToken(function executor(c) {
            // An executor function receives a cancel function as a parameter
            cancel = c;
          }),
        })
        .then((response) => setLoans(...loans, response.data))
        .catch((error) => {
          if (Axios.isCancel(error)) {
            console.log('Request canceled', error.message);
          } else {
            Alert.alert('Erro status: ' + error.response.status, error.response.data.error);
          }
        });
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <>
      <Header
        leftClick={() => {
          if (cancel) cancel();
        }}
        navigation={navigation}
        name="Histórico"
        rightButton="md-add"
        rightClick={() => navigation.navigate('LoanNewScreen')}
      />
      <LoadingScreen loading={loading} />
      <View style={styles.filter}>
        <TextInput style={styles.textFilter} placeholder="Cliente" onChangeText={(text) => updateSearch(text)}></TextInput>
      </View>
      <ScrollView style={styles.CustomerList}>
        {filteredLoans.map((loan) => (
          <LoanItem navigation={navigation} emprestimo={loan} key={Math.random()} />
        ))}
      </ScrollView>
    </>
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
