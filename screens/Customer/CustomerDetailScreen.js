import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Axios from 'axios';

import Header from '../../components/Header';
import LoadingScreen from '../../components/LoadingScreen';
import SaveButton from '../../components/SaveButton';
import LoanItem from '../../components/LoanItem';
import TextField from '../../components/TextField';
import api from '../../services/api';

const CancelToken = Axios.CancelToken;
let cancel;

export default function CustomerDetailScreen({ navigation, route }) {
  const [customer, setCustomer] = useState([]);
  const [originalCustomer, setOriginalCustomer] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (customer.id && originalCustomer.id) {
      if (customer.name !== originalCustomer.name) {
        setIsEditMode(true);
      } else {
        setIsEditMode(false);
      }
    }
  }, [customer, originalCustomer]);

  useEffect(() => {
    console.log(loans);
  }, [loans]);

  async function loadData() {
    await api
      .get('/clientes/' + route.params?.customerId, {
        cancelToken: new CancelToken(function executor(c) {
          // An executor function receives a cancel function as a parameter
          cancel = c;
        }),
      })
      .then((response) => {
        setCustomer(response.data);
        setOriginalCustomer(response.data);
        setLoans(response.data.emprestimos);
      })
      .catch((error) => {
        if (Axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          Alert.alert('Erro status: ' + error.response.status, error.response.data.error);
        }
      });

    setLoading(false);
  }

  function DeleteRecord() {
    Alert.alert('Aviso', 'Deseja realmente deletar este registro?', [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      { text: 'OK', onPress: () => ApiDelete() },
    ]);
  }

  async function ApiDelete() {
    setLoading(true);
    await api
      .delete('/clientes/' + route.params?.customerId, {
        cancelToken: new CancelToken(function executor(c) {
          // An executor function receives a cancel function as a parameter
          cancel = c;
        }),
      })
      .then(() => {
        Alert.alert('Sucesso', 'Cliente deletado com sucesso!');
        navigation.navigate('Home');
      })
      .catch((error) => {
        if (Axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          Alert.alert('Erro status: ' + error.response.status, error.response.data.error);
        }
      });
  }

  async function ApiPut() {
    setLoading(true);
    await api
      .put('/clientes/', customer, {
        cancelToken: new CancelToken(function executor(c) {
          // An executor function receives a cancel function as a parameter
          cancel = c;
        }),
      })
      .then(() => {
        Alert.alert('Sucesso', 'Cliente atualizado com sucesso!');
        loadData();
      })
      .catch((error) => {
        if (Axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          Alert.alert('Erro status: ' + error.response.status, error.response.data.error);
        }
      });
  }

  function SaveChanges() {
    Alert.alert('Aviso', 'Deseja salvar as alterações?', [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      { text: 'OK', onPress: () => ApiPut() },
    ]);
  }
  
  return (
    <>
      <Header
        leftClick={() => {
          if (cancel) cancel();
        }}
        navigation={navigation}
        name="Clientes"
        rightButton="ios-trash"
        rightClick={() => DeleteRecord()}
      />
      <LoadingScreen loading={loading} />
      <ScrollView style={styles.container}>
        <TextField
          label="Id:"
          value={customer.id?.toString()}
          editable={false}
        />
        <TextField
          label="Nome:"
          value={customer.name}
          editable={true}
          onChange={(text) => setCustomer({ ...customer, name: text })}
        />
        {/* <TextField label="Emprestimos ativos:" value={'0'} editable={false} /> */}
        <View style={styles.loans}>
          <Text style={styles.title}>Emprestimos:</Text>
          {loans.map((loan) => (
            <LoanItem navigation={navigation} emprestimo={loan} key={loan.id} />
          ))}
        </View>
      </ScrollView>
      <SaveButton display={isEditMode} onClick={() => SaveChanges()} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 15,
    paddingHorizontal: 20
  },
  loans: {
    marginTop: 5
  },
  title: {
    fontSize: 16,
    marginBottom: 5
  },
});
