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
  const [loan, setLoan] = useState([]);
  const [originalLoan, setOriginalLoan] = useState([]);
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  const changeDateFormatTo = (date) => {
    if (date) {
      const [yy, mm, dd] = date.substring(0, 10).split(/-/g);
      return `${dd}/${mm}/${yy}`;
    }
  };

  const getDate = (date) => {
    if (date) {
      const formatedDate = changeDateFormatTo(date)
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

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    await api
      .get(
        '/emprestimos/' + route.params?.customerId + '/' + route.params?.loanId,
        {
          cancelToken: new CancelToken(function executor(c) {
            // An executor function receives a cancel function as a parameter
            cancel = c;
          }),
        }
      )
      .then((response) => {
        console.log(response);
        setLoan(response.data.emprestimo);
        setOriginalLoan(response.data.emprestimo);
        setParcels(response.data.parcelas);
      })
      .catch((error) => {
        if (Axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          alert(error.message);
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
      .delete('/clientes/' + route.params?.loanId, {
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
          alert(error.message);
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
          alert(error.message);
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
          cancel();
        }}
        navigation={navigation}
        name="Emprestimos"
        rightButton="ios-trash"
        rightClick={() => DeleteRecord()}
      />
      <LoadingScreen loading={loading} />
      <ScrollView style={styles.container}>
        <TextField label="Cliente:" value={loan.name} editable={false} />
        <TextField
          label="Emprestimo:"
          value={loan.idEmprestimo?.toString()}
          editable={false}
        />
        <TextField
          label="Status:"
          value={loan.pago?.toString()}
          editable={false}
        />
        <TextField
          label="Data inicio:"
          value={changeDateFormatTo(loan.dataInicio)}
          editable={false}
        />
        <View style={{flexDirection: 'row'}}>
          <TextField
            label="Valor Recebido:"
            value={loan.valorPago ? loan.valorPago?.toFixed(2).replace('.', ',') : '0,00'}
            editable={false}
          />
          <View style={{width: 20}}></View>
          <TextField
            label="Valor Emprestado:"
            value={loan.valorEmprestimo ? loan.valorEmprestimo?.toFixed(2).replace('.', ',') : '0,00'}
            editable={false}
          />
        </View>
        <View style={{flexDirection: 'row'}}>
          <TextField
            label="Parcelas Pagas:"
            value={loan.numParcelasPagas?.toString()}
            editable={false}
          />
          <View style={{width: 20}}></View>
          <TextField
            label="Parcelas:"
            value={loan.numParcelas?.toString()}
            editable={false}
          />
        </View>
        <View style={styles.parcels}>
          <Text style={styles.title}>Parcelas:</Text>
          {parcels.map((parcel) => (
            <View key={parcel.parcelaNum} style={styles.parcelItem} >
              <View style={styles.header}>
                <Text style={styles.headerText}>{parcel.parcelaNum} - {getDate(parcel.dataParcela)}</Text>
                <Text style={[styles.headerText, {textAlign: 'right'}]}>R${parcel.valorParcela ? parcel.valorParcela?.toFixed(2).replace('.', ',') : '0,00'}</Text>
              </View>
              <View style={styles.card}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text style={styles.parcelText}>Pago: R${parcel.valorPago ? parcel.valorPago?.toFixed(2).replace('.', ',') : '0,00'}</Text>
                  <Text style={styles.parcelText}>Valor: R${parcel.valorParcela ? parcel.valorParcela?.toFixed(2).replace('.', ',') : '0,00'}</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text style={styles.parcelText}>Cobrado: {parcel.cobrado}</Text>
                  <Text style={styles.parcelText}>Status: Andamento</Text>
                </View>
                <Text style={styles.parcelText}>Quem recebeu: {parcel.idUserRecebeu}</Text>
              </View>
            </View>
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
    paddingHorizontal: 20,
  },
  parcels: {
    marginTop: 5,
    marginBottom: 20
  },
  title: {
    fontSize: 16,
    marginBottom: 5
  },
  header: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 3,
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
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  parcelText: {
    fontSize: 15
  }
});
