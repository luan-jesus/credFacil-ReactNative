import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native';
import { Text, StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import Header from '../../components/Header';
import LoadingScreen from '../../components/LoadingScreen';
import SaveButton from '../../components/SaveButton';
import LoanItem from '../../components/LoanItem'
import api from '../../services/api';


export default function CustomerDetailScreen({ navigation, route }) {
  const [customer, setCustomer] = useState([]);
  const [originalCustomer, setOriginalCustomer] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (customer.id && originalCustomer.id){
      if (customer.name !== originalCustomer.name){
        setIsEditMode(true);
      } else {
        setIsEditMode(false);
      }
    }
  }, [customer, originalCustomer])

  useEffect(() => {
    console.log(loans);
  }, [loans]);

  async function loadData() {
    await api.get('/clientes/' + route.params?.customerId)
      .then(response => {
        setCustomer(response.data.cliente);
        setOriginalCustomer(response.data.cliente);
        setLoans(response.data.emprestimos);
      })
      .catch(error=> alert(error.message));
      
    setLoading(false);
  }

  function DeleteRecord(){
    Alert.alert('Aviso', 'Deseja realmente deletar este registro?', [
      {text: 'Cancel', onPress: () => {}, style: 'cancel'},
      {text: 'OK', onPress: () => ApiDelete()}
    ]);
  }

  async function ApiDelete(){
    setLoading(true)
    await api.delete('/clientes/' + route.params?.customerId)
      .then(() => {
        Alert.alert('Sucesso', 'Cliente deletado com sucesso!');
        navigation.navigate('Home');
      })
  }

  async function ApiPut() {
    setLoading(true);
    await api.put('/clientes/', customer)
      .then(() => {
        Alert.alert('Sucesso', 'Cliente atualizado com sucesso!');
        loadData();
      })
      .catch(error => console.log(error));
  }

  function SaveChanges() {
    Alert.alert('Aviso', 'Deseja salvar as alterações?', [
      {text: 'Cancel', onPress: () => {}, style: 'cancel'},
      {text: 'OK', onPress: () => ApiPut()}
    ]);
  }

  const emprestimo = JSON.parse('{"id": 1, "Cliente": "","valorEmprestimo": 2400.00, "valorPago": 1300.00, "numParcelas": 24, "numParcelasPagas": 13,"dataInicio": "2019-01-11T02:00:00.000Z","status": 1,"createdAt": "2020-04-03T17:14:33.262Z","updatedAt": "2020-04-03T17:14:33.262Z"}');

  return (
    <>
      <Header navigation={navigation} name='Clientes' rightButton='ios-trash' rightClick={() => DeleteRecord()}/>
      <LoadingScreen loading={loading}/>
      <ScrollView style={styles.container}>
        <View style={styles.field}>
          <Text>Id do Cliente:</Text>
          <TextInput style={styles.textField} value={customer.id?.toString()} editable={false}></TextInput>
        </View>
        <View style={styles.field}>
          <Text>Nome do Cliente:</Text>
          <TextInput style={[styles.textField, {backgroundColor: '#f5f5f5'}]} value={customer.name} onChangeText={text => setCustomer({ ...customer, name: text })}></TextInput>
        </View>
        <View style={styles.field}>
          <Text>Emprestimos Ativos:</Text>
          <TextInput style={styles.textField} value='0' editable={false}></TextInput>
        </View>
        <View style={styles.field}>
          <Text>Parcelas atrasadas:</Text>
          <TextInput style={styles.textField} value='0' editable={false}></TextInput>
        </View>
        <View style={styles.loans}>
          {loans.map(loan => (
            <LoanItem emprestimo={loan} key={loan.idEmprestimo}/>
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
    paddingTop: 15
  },
  field: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    marginHorizontal: 20,
  },
  textField: {
    backgroundColor: '#dbdbdb',
    width: 140,
    textAlign: 'right',
    borderColor: '#dbdbdb',
    borderWidth: 1,
    paddingHorizontal: 5
  },
  loans: {
    margin: 5,
    paddingHorizontal: 15,
  }
});
