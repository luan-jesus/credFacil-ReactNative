import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Axios from 'axios';

import Header from '../../components/Header';
import LoadingScreen from '../../components/LoadingScreen';
import TextField from '../../components/TextField';
import { AsyncStorage } from 'react-native';
import api from '../../services/api';

const CancelToken = Axios.CancelToken;
let cancel;


export default function ParcelHistScreen({ navigation }) {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {

    let x = new Date();
    let today = new Date(x.getFullYear(), x.getMonth(), x.getDate());

    const loginId = await AsyncStorage.getItem('userId');


    await api
      .post('/motoboy/' + loginId,
      {
        dataParcela: today
      },
      {
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

  const changeDateFormatTo = (date) => {
    if (date) {
      const [yy, mm, dd] = date.substring(0, 10).split(/-/g);
      return `${dd}/${mm}/${yy}`;
    }
  };

  const getDate = (date) => {
    if (date) {
      const formatedDate = changeDateFormatTo(date);
      const dateObj = new Date(date);
      switch (dateObj.getDay()) {
        case 0:
          return 'Dom ' + formatedDate;
        case 1:
          return 'Seg ' + formatedDate;
        case 2:
          return 'Ter ' + formatedDate;
        case 3:
          return 'Qua ' + formatedDate;
        case 4:
          return 'Qui ' + formatedDate;
        case 5:
          return 'Sex ' + formatedDate;
        case 6:
          return 'Sab ' + formatedDate;
      }
    }
  };

  return (
    <>
      <Header leftClick={() => {if (cancel) cancel();}} navigation={navigation} name="Parcelas" />
      <LoadingScreen loading={loading} />
      <ScrollView style={styles.container}>
        <TextField
          label="Total:"
          value={user?.receivedToday ? parseFloat(user?.receivedToday).toFixed(2).replace('.', ',') : '0,00'}
          editable={false}
        />
        <Text style={{fontSize: 16, marginBottom: 5}}>historico:</Text>
        {user?.historico?.map(hist => (
          <View style={styles.card} key={Math.random()}>
            <View style={styles.header}>
              <Text style={styles.headerText}>{hist?.emprestimo?.cliente?.name}</Text>
              <Text style={[styles.headerText, {textAlign: 'right', flex: 1}]}>
                Recebido: R$ {parseFloat(hist.valor).toFixed(2).replace('.', ',')}
              </Text>
            </View>
            <View style={{paddingTop: 3,paddingHorizontal: 10,paddingBottom: 10,}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={{fontStyle: 'italic'}}>Data: </Text>
                <Text>{changeDateFormatTo(hist.data)}</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={{fontStyle: 'italic'}}>Emprestimo: </Text>
                <Text>{hist?.emprestimo?.id}</Text>
                <Text style={{fontStyle: 'italic', flex: 1, textAlign: 'right'}}>Parcela: </Text>
                <Text>{hist?.parcelanum}</Text>
              </View>
            </View>
          </View>
        ))}
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
  card: {
    borderBottomColor: 'gray',
    marginVertical: 5,
    marginHorizontal: 5,
    backgroundColor: '#f5f5f5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  header: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ff9538',
  },
  headerText: {
    fontSize: 15,
    color: '#fff',
  },
});
