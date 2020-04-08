import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LoanItem({ emprestimo, navigation }) {
  const {
    idCliente,
    idEmprestimo,
    Cliente,
    valorAReceber,
    valorPago,
    numParcelas,
    numParcelasPagas,
    dataInicio,
    status,
  } = emprestimo;

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
        x = 'Pago com alertas';
        break;
      case 3:
        x = 'Pago com Atrasos';
        break;
    }
    return x;
  }

  const changeDateFormatTo = (date) => {
    const [yy, mm, dd] = date.substring(0, 10).split(/-/g);
    return `${dd}/${mm}/${yy}`;
  };

  function statusColor(status) {
    let x = '';
    switch (status) {
      case -1:
        x = '#f5f5f5';
        break;
      case 0:
        x = '#fdffa1';
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
    return x
  }

  return (
    <TouchableOpacity 
      style={styles.loanItem} 
      onPress={() => {
        navigation.navigate('LoanDetailScreen', { customerId: idCliente, loanId: idEmprestimo })
      }}
    >
      <View style={styles.header}>{Cliente ? (<Text style={styles.headerText}>{Cliente}</Text>) : (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.headerText}>
              Emprestimo:  {idEmprestimo}
            </Text>
            <Text style={styles.headerText}>
              {getStatus(status)}
            </Text>
          </View>
        )}</View>
      <View style={[styles.card, {backgroundColor: statusColor(status)}]}>
        {Cliente ? (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 16 }}>
              Emprestimo:  {idEmprestimo}
            </Text>
            <Text style={{ fontSize: 16 }}>
              <Text style={{}}>{getStatus(status)}</Text>
            </Text>
          </View>
        ) : null}
        <Text style={{ marginBottom: 10 }}>
          <Text style={{ fontWeight: 'bold' }}>Inicio:{' '}</Text>
          <Text style={{ fontWeight: 'normal' }}>
            {changeDateFormatTo(dataInicio)}
          </Text>
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 13, fontWeight: 'bold' }}>
            Total:{' '}
            <Text style={{ fontWeight: 'normal' }}>
              R${valorAReceber.toFixed(2).replace('.', ',')}
            </Text>
          </Text>
          <Text style={{ fontSize: 13, fontWeight: 'bold' }}>
            Parcelas:{' '}
            <Text style={{ fontWeight: 'normal' }}>{numParcelas}</Text>
          </Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 13, fontWeight: 'bold' }}>
            Pago:{' '}
            <Text style={{ fontWeight: 'normal' }}>
              R${valorPago.toFixed(2).replace('.', ',')}
            </Text>
          </Text>
          <Text style={{ fontSize: 13, fontWeight: 'bold' }}>
            Pagas:{' '}
            <Text style={{ fontWeight: 'normal' }}>{numParcelasPagas}</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loanItem: {
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
    textAlign: 'left',
    backgroundColor: '#ff9538',
  },
  headerText: {
    color: '#fff',
    fontSize: 17,
  },
  card: {
    paddingTop: 3,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
});
