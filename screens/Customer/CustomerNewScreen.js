import React, { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Axios from 'axios';

import Header from '../../components/Header';
import api from '../../services/api';
import LoadingScreen from '../../components/LoadingScreen';
import SaveButton from '../../components/SaveButton';
import TextField from '../../components/TextField';

const CancelToken = Axios.CancelToken;
let cancel;

export default function CustomerNewScreen({ navigation }) {
  const [customer, setCustomer] = useState({ name: '' });
  const [loading, setLoading] = useState(false);

  function CreateCustomer() {
    if (customer.name === '') {
      Alert.alert('Atenção', 'Nome é obrigatório');
    } else {
      Alert.alert('Alerta', 'Deseja prosseguir com a criação do registro?', [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        { text: 'OK', onPress: () => PostCreate() },
      ]);
    }
  }

  async function PostCreate() {
    setLoading(true);
    await api
      .post('/clientes', customer, {
        cancelToken: new CancelToken(function executor(c) {
          // An executor function receives a cancel function as a parameter
          cancel = c;
        }),
      })
      .then(() => {
        Alert.alert('Sucesso', 'Cliente criado com sucesso!');
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

  return (
    <>
      <Header
        leftClick={() => {
          if (cancel) cancel();
        }}
        navigation={navigation}
        name="Clientes"
      />
      <LoadingScreen loading={loading} />
      <ScrollView style={styles.container}>
        <TextField
          label="Nome:"
          editable={true}
          onChange={(text) => setCustomer({ ...customer, name: text })}
        />
      </ScrollView>
      <SaveButton
        display={customer.name != ''}
        onClick={() => CreateCustomer()}
      />
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
});
