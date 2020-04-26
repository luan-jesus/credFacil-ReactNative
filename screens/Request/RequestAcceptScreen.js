import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import DatePicker from 'react-native-datepicker';
import NumericInput from 'react-native-numeric-input';
import RNPickerSelect from 'react-native-picker-select';
import Axios from 'axios';

import Header from '../../components/Header';
import LoadingScreen from '../../components/LoadingScreen';
import SaveButton from '../../components/SaveButton';
import TextField from '../../components/TextField';
import WeekDayPicker from '../../components/WeekDayPicker';
import api from '../../services/api';

const CancelToken = Axios.CancelToken;
let cancel;

export default function RequestAccept({ navigation, route }) {
  const [loan, setLoan] = useState({
    idCliente: 0,
    valorEmprestimo: 0,
    valorAReceber: 0,
    numParcelas: 0,
    dataInicio:
      new Date().getDate() +
      '-' +
      (new Date().getMonth() + 1) +
      '-' +
      new Date().getFullYear(),
  });
  const [loading, setLoading] = useState(false);
  const [weekDay, setWeekDay] = useState({
    '0': false,
    '1': false,
    '2': false,
    '3': false,
    '4': false,
    '5': false,
    '6': false,
  });

  const changeDateFormatTo = (date) => {
    if (date) {
      const [dd, mm, yy] = date.substring(0, 10).split(/-/g);
      return `${mm}/${dd}/${yy}`;
    }
  };

  async function ApiPost() {
    setLoading(true);

    await api
      .delete('/emprestimos/' + route.params?.id, {
        cancelToken: new CancelToken(function executor(c) {
          cancel = c;
        }),
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

    await api
      .post(
        '/emprestimos',
        {
          idCliente: route.params.clienteId,
          valorEmprestimo: route.params.valorEmprestimo,
          valorAReceber: loan.valorAReceber,
          numParcelas: loan.numParcelas,
          dataInicio: changeDateFormatTo(loan.dataInicio),
          frequencia: loan.frequencia,
          diaSemana: weekDay,
        },
        {
          cancelToken: new CancelToken(function executor(c) {
            cancel = c;
          }),
        }
      )
      .then(() => {
        Alert.alert('Sucesso', 'Emprestimo criado com sucesso!');
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

  function SaveChanges() {
    Alert.alert('Aviso', 'Deseja salvar as alterações?', [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      { text: 'OK', onPress: () => ApiPost() },
    ]);
  }

  function Frequencia() {
    if (loan.frequencia == 1) {
      return true;
    } else {
      if (
        weekDay[0] ||
        weekDay[1] ||
        weekDay[2] ||
        weekDay[3] ||
        weekDay[4] ||
        weekDay[5] ||
        weekDay[6]
      ) {
        return true;
      } else {
        return false;
      }
    }
  }

  return (
    <>
      <Header
        leftClick={() => {
          if (cancel) cancel();
        }}
        navigation={navigation}
        name="Emprestimos"
      />
      <LoadingScreen loading={loading} />
      <ScrollView style={styles.container}>
        <TextField
          label="Cliente:"
          value={route.params?.clienteName}
          editable={false}
        />
        <View>
          <Text style={styles.title}>Data Inicio:</Text>
          <DatePicker
            mode="date"
            date={loan.dataInicio}
            style={{ width: 'auto' }}
            placeholder="select date"
            format="DD-MM-YYYY"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            showIcon={false}
            customStyles={{
              dateInput: {
                backgroundColor: '#fff',
                alignItems: 'flex-start',
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderColor: '#cccccc',
                borderWidth: 1,
                borderRadius: 5,
              },
              dateText: {
                fontSize: 15,
                textAlign: 'left',
                color: '#000',
              },
            }}
            onDateChange={(date) => {
              setLoan({ ...loan, dataInicio: date });
            }}
          />
        </View>
        <TextField
          label="Valor Emprestimo:"
          value={parseFloat(route.params?.valorEmprestimo).toFixed(2).replace('.', ',')}
          editable={false}
        />
        <TextField
          label="Valor a Receber:"
          value={loan.valorAReceber.toFixed(2).replace('.', ',')}
          editable={true}
          keyboardType="decimal-pad"
          onChange={(text) => {
            setLoan({
              ...loan,
              valorAReceber: parseFloat(text.replace(',', '')) / 100,
            });
          }}
        />
        <View>
          <Text style={styles.title}>Número de parcelas:</Text>
          <NumericInput
            borderColor="#cccccc"
            minValue={1}
            rounded
            onChange={(value) => setLoan({ ...loan, numParcelas: value })}
          />
        </View>
        <View>
          <Text style={[styles.title, { marginTop: 5 }]}>Frequencia:</Text>
          <RNPickerSelect
            onValueChange={(value) => setLoan({ ...loan, frequencia: value })}
            style={{
              inputAndroid: {
                borderColor: '#000',
                marginVertical: -4,
              },
              placeholder: {
                fontSize: 15,
                textAlign: 'left',
                color: '#000',
              },
              viewContainer: {
                backgroundColor: '#fff',
                fontSize: 15,
                textAlign: 'left',
                borderColor: '#cccccc',
                borderWidth: 1,
                borderRadius: 5,
                marginBottom: 10,
              },
            }}
            placeholder={{ label: 'Selecione a frequência' }}
            items={[
              { label: 'Diário', value: 1 },
              { label: 'Semanal', value: 2 },
            ]}
          />
          <WeekDayPicker
            value={weekDay}
            onChange={(value) => setWeekDay(value)}
            display={loan.frequencia === 2}
          />
        </View>
      </ScrollView>
      <SaveButton
        display={
          loan.valorAReceber &&
          loan.numParcelas &&
          Frequencia()
        }
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
  title: {
    fontSize: 16,
    marginBottom: 5,
  },
  textField: {
    backgroundColor: '#fff',
    fontSize: 15,
    textAlign: 'left',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
  },
});
