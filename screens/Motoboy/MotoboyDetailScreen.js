import React, { useState, useEffect } from 'react';
import { StyleSheet, } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Axios from 'axios';

import Header from '../../components/Header';
import LoadingScreen from '../../components/LoadingScreen';
import TextField from '../../components/TextField'; 
import api from '../../services/api';

const CancelToken = Axios.CancelToken;
let cancel;


export default function MotoboyDetailScreen({ navigation, route }) {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    await api
      .get('/users/' + route.params?.userId, {
        cancelToken: new CancelToken(function executor(c) {
          // An executor function receives a cancel function as a parameter
          cancel = c;
        }),
      })
      .then((response) => {
        setUser(response.data);
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

  return (
    <>
      <Header leftClick={() => {if (cancel) cancel();}} navigation={navigation} name="Motoboys" />
      <LoadingScreen loading={loading} />
      <ScrollView style={styles.container}>
        <TextField
          label="Id:"
          value={user.id?.toString()}
          editable={false}
        />
        <TextField
          label="Nome:"
          value={user?.name}
          editable={false}
        />
        <TextField
          label="Total recebido Hoje:"
          value={user.totalRecebido ? user.totalRecebido?.toFixed(2).replace('.', ',') : '0,00'}
          editable={false}
        />
      </ScrollView>
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
