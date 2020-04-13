import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, Text, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Axios from 'axios';

import Header from '../../components/Header';
import LoadingScreen from '../../components/LoadingScreen';
import SaveButton from '../../components/SaveButton';
import TextField from '../../components/TextField';
import api from '../../services/api';

const CancelToken = Axios.CancelToken;
let cancel;

export default function CustomerDetailScreen({ navigation, route }) {
  const [loan, setLoan] = useState([]);
  const [originalLoan, setOriginalLoan] = useState([]);
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);

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

  function statusColor(status) {
    let x = '';
    switch (status) {
      case -1:
        x = '#f5f5f5';
        break;
      case 0:
        x = '#ffa1a1';
        break;
      case 1:
        x = '#f5f5f5';
        break;
      case 2:
        x = '#fdffa1';
        break;
      case 3:
        x = '#fdffa1';
        break;
    }
    return x;
  }

  function getStatus(status) {
    let x = '';
    switch (status) {
      case -1:
        x = 'Andamento';
        break;
      case 0:
        x = 'Não Pago';
        break;
      case 1:
        x = 'Pago';
        break;
      case 2:
        x = 'Pago com ressalvas';
        break;
      case 3:
        x = 'Pago com atrasos';
        break;
    }
    return x;
  }

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    await api
      .get('/emprestimos/' + route.params?.loanId, {
        cancelToken: new CancelToken(function executor(c) {
          cancel = c;
        }),
      })
      .then((response) => {
        console.log(response);
        setLoan(response.data);
        setOriginalLoan(response.data);
        setParcels(response.data.parcelas);
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

  function DeleteRecord() {
    Alert.alert('Aviso', 'Deseja realmente deletar este registro?', [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      { text: 'OK', onPress: () => ApiDelete() },
    ]);
  }

  async function ApiDelete() {
    setLoading(true);
    await api
      .delete('/emprestimos/' + route.params?.loanId, {
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
        name="Emprestimos"
        rightButton="ios-trash"
        rightClick={() => DeleteRecord()}
      />
      <LoadingScreen loading={loading} />
      <ScrollView style={styles.container}>
        <TextField
          label="Cliente:"
          value={loan?.cliente?.name}
          editable={false}
        />
        <TextField
          label="Emprestimo:"
          value={loan.id?.toString()}
          editable={false}
        />
        <TextField
          label="Status:"
          value={getStatus(loan.status)}
          editable={false}
        />
        <TextField
          label="Data inicio:"
          value={changeDateFormatTo(loan.dataInicio)}
          editable={false}
        />
        <View style={{ flexDirection: 'row' }}>
          <TextField
            label="Valor Recebido:"
            value={
              loan.valorPago
                ? parseFloat(loan.valorPago)?.toFixed(2).replace('.', ',')
                : '0,00'
            }
            editable={false}
          />
          <View style={{ width: 20 }}></View>
          <TextField
            label="Valor a Receber:"
            value={
              loan.valorEmprestimo
                ? parseFloat(loan.valorAReceber)?.toFixed(2).replace('.', ',')
                : '0,00'
            }
            editable={false}
          />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <TextField
            label="Parcelas Pagas:"
            value={loan.numParcelasPagas?.toString()}
            editable={false}
          />
          <View style={{ width: 20 }}></View>
          <TextField
            label="Parcelas:"
            value={loan.numParcelas?.toString()}
            editable={false}
          />
        </View>
        <View style={styles.parcels}>
          <Text style={styles.title}>Parcelas:</Text>
          {parcels.map((parcel) => (
            <TouchableOpacity 
              key={parcel.parcelaNum} 
              style={styles.parcelItem}
              onPress={() =>
                navigation.navigate('ParcelDetailScreen', { parcelId: parcel.id })
              }
            >
              <View style={styles.header}>
                <Text style={styles.headerText}>
                  {parcel.parcelaNum} - {getDate(parcel.dataParcela)}
                </Text>
                <Text style={[styles.headerText, { textAlign: 'right' }]}>
                  R$
                  {parcel.valorParcela
                    ? parseFloat(parcel.valorParcela)
                        ?.toFixed(2)
                        .replace('.', ',')
                    : '0,00'}
                </Text>
              </View>
              <View
                style={[
                  styles.card,
                  { backgroundColor: statusColor(parcel.status) },
                ]}
              >
                {parcel.cobrado ? (
                  <>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginVertical: 3,
                      }}
                    >
                      <Text style={styles.parcelText}>
                        <Text style={{ fontStyle: 'italic' }}>Pago: </Text>R$
                        {parcel.valorPago
                          ? parseFloat(parcel.valorPago)
                              ?.toFixed(2)
                              .replace('.', ',')
                          : '0,00'}
                      </Text>
                      <Text style={styles.parcelText}>
                        {getStatus(parcel.status)}
                      </Text>
                    </View>
                    <Text style={[styles.parcelText, { marginTop: 3 }]}>
                      <Text style={{ fontStyle: 'italic' }}>Cobrado por: </Text>
                      {parcel?.user?.name}
                    </Text>
                  </>
                ) : null}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
  parcels: {
    marginTop: 5,
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    marginBottom: 5,
  },
  header: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ff9538',
  },
  headerText: {
    fontSize: 17,
    color: '#fff',
  },
  parcelItem: {
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
  card: {
    paddingTop: 3,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  parcelText: {
    fontSize: 15,
  },
});
