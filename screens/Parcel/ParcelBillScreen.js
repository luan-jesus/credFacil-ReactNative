import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { AsyncStorage } from 'react-native';
import Axios from 'axios';

import Header from '../../components/Header';
import LoadingScreen from '../../components/LoadingScreen';
import SaveButton from '../../components/SaveButton';
import TextField from '../../components/TextField';
import api from '../../services/api';

const CancelToken = Axios.CancelToken;
let cancel;

export default function ParcelBillScreen({ navigation, route }) {
  const [parcel, setParcel] = useState({cobrado: true});
  const [userId, setUserId] = useState(0);
  const [loading, setLoading] = useState(true);

  const changeDateFormatTo = (date) => {
    if (date) {
      const [yy, mm, dd] = date.substring(0, 10).split(/-/g);
      return `${dd}/${mm}/${yy}`;
    }
  };

  useEffect(() => {
      loadData();
  }, []);

  async function loadData() {
    try {
      const loginId = await AsyncStorage.getItem('userId');
      setUserId(parseInt(loginId));
    } catch (error) {
      Alert.alert('Erro', error.message);
    }

    await api
      .get('/parcelas/' + route.params?.parcelId, {
        cancelToken: new CancelToken(function executor(c) {
          cancel = c;
        }),
      })
      .then((response) => {
        setParcel(response.data);
      })
      .catch((error) => {
        if (Axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          Alert.alert(
            'Erro status: ' + error.response.status,
            error.response.data.error
          );
        }
      });
    setLoading(false);
  }

  async function ApiPost() {
    setLoading(true);

    await api
      .post('/parcelas/' + route.params?.parcelId + '/receber', 
        {
          valorParcela: parcel.valorParcela,
          valorPago: parcel.valorPago,
          cobrado: true,
          emprestimoId: parcel.emprestimo.id,
          userId: userId
        },
        {
          cancelToken: new CancelToken(function executor(c) {
            cancel = c;
          }),
        })
      .then(() => {
        Alert.alert('Sucesso', 'Parcela recebida com sucesso!');
        navigation.navigate('ParcelsScreen');
      })
      .catch((error) => {
        if (Axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          Alert.alert(
            'Erro status: ' + error.response.status,
            error.response.data.error
          );
        }
      });
  }

  function SaveChanges() {
    Alert.alert('Aviso', 'Deseja receber a parcela?', [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      { text: 'OK', onPress: () => ApiPost() },
    ]);
  }

  return (
    <>
      <Header
        leftClick={() => {
          if (cancel) cancel();
        }}
        navigation={navigation}
        name="Cobrar parcela"
      />
      <LoadingScreen loading={loading} />
      <ScrollView style={styles.container}>
        <TextField
          label="Emprestimo:"
          value={parcel?.emprestimo?.id?.toString()}
          editable={false}
        />
        <TextField
          label="Cliente:"
          value={parcel?.emprestimo?.cliente?.name}
          editable={false}
        />
        <TextField
          label="Parcela:"
          value={parcel?.parcelaNum?.toString()}
          editable={false}
        />
        <TextField
          label="Data do pagamento:"
          value={changeDateFormatTo(parcel?.dataParcela)}
          editable={false}
        />
        <TextField
          label="Valor da parcela:"
          value={
            parcel?.valorParcela
              ? parseFloat(parcel?.valorParcela)?.toFixed(2).replace('.', ',')
              : '0,00'
          }
          editable={false}
        />
        <TextField
          label="Valor Pago:"
          value={
            parcel?.valorPago
              ? parseFloat(parcel?.valorPago)?.toFixed(2).replace('.', ',')
              : '0,00'
          }
          editable={true}
          keyboardType="decimal-pad"
          onChange={(text) => {
            setParcel({
              ...parcel,
              valorPago: parseFloat(text.replace(',', '')) / 100,
            });
          }}
        />
      </ScrollView>
      <SaveButton
        display={true}
        onClick={() => {
          SaveChanges();
        }}
        buttonText="Receber pagamento"
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 15,
    paddingHorizontal: 20,
  },
  loans: {
    marginTop: 5,
  },
  title: {
    fontSize: 16,
    marginBottom: 5,
  },
});
