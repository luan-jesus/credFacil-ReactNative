import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, Text, CheckBox } from 'react-native';
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
  const [parcel, setParcel] = useState();
  const [originalParcel, setOriginalParcel] = useState();
  const [userId, setUserId] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [cobrado, setCobrado] = useState();
  const [loading, setLoading] = useState(true);

  const changeDateFormatTo = (date) => {
    if (date) {
      const [yy, mm, dd] = date.substring(0, 10).split(/-/g);
      return `${dd}/${mm}/${yy}`;
    }
  };

  useEffect(() => {
    console.log(cobrado !== originalParcel?.cobrado);
  }, [cobrado]);

  useEffect(() => {
    console.log(parseFloat(parcel?.valorParcela) + ' ' +  parseFloat(originalParcel?.valorParcela))
    if (
      parcel?.valorParcela &&
      parcel?.valorPago &&
      parcel?.cobrado &&
      originalParcel?.valorParcela &&
      originalParcel?.valorPago &&
      originalParcel?.cobrado
      ) {
      if (
        parcel.valorParcela != originalParcel.valorParcela ||
        parcel.valorPago != originalParcel.valorPago ||
        parcel.cobrado != originalParcel.cobrado
        ) {
        setIsEditMode(true);
      } else {
        setIsEditMode(false);
      }
    }
  }, [parcel, originalParcel]);

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
        setOriginalParcel(response.data);
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
      .post('/parcelas/' + route.params?.parcelId + '/receber', {
          valorParcela: parcel.valorParcela,
          valorPago: parcel.valorPago,
          cobrado: parcel.cobrado,
          emprestimoId: parcel.emprestimo.id,
          userId: userId
      }, {
        cancelToken: new CancelToken(function executor(c) {
          cancel = c;
        }),
      })
      .then(() => {
        Alert.alert('Sucesso', 'Parcela salva com sucesso!');
        navigation.navigate('Home')
        loadData();
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

  async function ApiDelete() {
    setLoading(true);
    await api
      .delete('/parcelas/' + route.params?.parcelId, {
        cancelToken: new CancelToken(function executor(c) {
          cancel = c;
        }),
      })
      .then(() => {
        Alert.alert('Sucesso', 'Emprestimo deletado com sucesso!');
        navigation.navigate('Home');
      })
      .catch((error) => {
        if (Axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          Alert.alert(
            'Erro status: ' + error.response.status,
            error.response.data.error
          );
          navigation.navigate('Home');
        }
      });
  }

  function SaveChanges() {
    Alert.alert('Aviso', 'Deseja salvar as auterações?', [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      { text: 'OK', onPress: () => ApiPost() },
    ]);
  }

  function DeleteRecord() {
    Alert.alert('Aviso', 'Deseja realmente deletar esta parcela?', [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      { text: 'OK', onPress: () => ApiDelete() },
    ]);
  }

  return (
    <>
      <Header
        leftClick={() => {
          if (cancel) cancel();
        }}
        navigation={navigation}
        name="Editar parcela"
        rightButton="ios-trash"
        rightClick={() => DeleteRecord()}
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
          keyboardType="decimal-pad"
          onChange={(text) => {
            setParcel({
              ...parcel,
              valorParcela: parseFloat(text.replace(',', '')) / 100,
            });
          }}
          editable={true}
        />
        <TextField
          label="Valor Pago:"
          value={
            parcel?.valorPago
              ? parseFloat(parcel?.valorPago)?.toFixed(2).replace('.', ',')
              : '0,00'
          }
          editable={parcel?.cobrado}
          keyboardType="decimal-pad"
          onChange={(text) => {
            setParcel({
              ...parcel,
              valorPago: parseFloat(text.replace(',', '')) / 100,
            });
          }}
        />
        <View style={styles.field}>
          <Text style={styles.title}>Cobrado:</Text>
          <CheckBox
            onValueChange={() => {
              if(parcel.cobrado) {
                setParcel(old => ({...old, valorPago: 0}));
              }
              setParcel(old => ({...old, cobrado: !parcel.cobrado}));
            }}
            value={parcel?.cobrado}
          />
        </View>
      </ScrollView>
      <SaveButton
        display={isEditMode || parcel?.cobrado !== originalParcel?.cobrado || parcel?.valorParcela != originalParcel?.valorParcela}
        onClick={() => SaveChanges()}
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
  field: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  title: {
    fontSize: 16,
    marginBottom: 5,
  },
});
