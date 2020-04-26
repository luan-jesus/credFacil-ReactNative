import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function RequestItem({ emprestimo, navigation, onDelete, onAccept }) {
  const {
    id,
    cliente,
    valorEmprestimo,
    dataInicio
  } = emprestimo;

  const changeDateFormatTo = (date) => {
    const [yy, mm, dd] = date.substring(0, 10).split(/-/g);
    return `${dd}/${mm}/${yy}`;
  };

  return (
    <View 
      style={styles.loanItem}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>{cliente?.name}</Text>
      </View>
      <View style={styles.card}>
        <View>
          <Text style={{ fontSize: 13, fontWeight: 'bold' }}>
            Data:{' '}
            <Text style={{ fontWeight: 'normal' }}>
              {changeDateFormatTo(dataInicio)}
            </Text>
          </Text>
        </View>
        <View style={{ marginBottom: 10 }}>
          <Text style={{ fontSize: 13, fontWeight: 'bold' }}>
            Solicitado:{' '}
            <Text style={{ fontWeight: 'normal' }}>
              R${parseFloat(valorEmprestimo).toFixed(2).replace('.', ',')}
            </Text>
          </Text>
        </View>
        
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity onPress={() => onAccept(id, cliente.id, cliente.name, valorEmprestimo)}>
            <Ionicons name="ios-checkmark-circle-outline" size={42} color={'#34eb3d'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(id)}>
            <Ionicons name="ios-close-circle-outline" size={42} color={'#eb4c34'} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
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
