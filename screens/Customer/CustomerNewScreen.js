import React, { useState } from 'react';
import { TextInput } from 'react-native';
import { Text, StyleSheet, View, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import Header from '../../components/Header';
import api from '../../services/api';
import LoadingScreen from '../../components/LoadingScreen';
import SaveButton from '../../components/SaveButton';

export default function CustomerNewScreen({ navigation }) {
  const [customer, setCustomer] = useState({ name: '' });
  const [loading, setLoading] = useState(false);

  function CreateCustomer() {
    if (customer.name === ''){
      Alert.alert('Atenção', 'Nome é obrigatório');
    }else {
      Alert.alert('Alerta', 'Deseja prosseguir com a criação do registro?',[
        {text: 'Cancel', onPress: () => {}, style: 'cancel'},
        {text: 'OK', onPress: () => PostCreate()}
      ]);
    }
  }

  async function PostCreate() {
    setLoading(true);
    await api.post('/clientes', customer)
      .then(() => {
        Alert.alert('Sucesso', 'Cliente criado com sucesso!');
        navigation.navigate('Home');
      })
      .catch(error => {
        Alert.alert('Erro', error.message);
        setLoading(false);
      });
  }

  return (
    <>
      <Header
        navigation={navigation}
        name="Clientes"
      />
      <LoadingScreen loading={loading}/>
      <ScrollView style={styles.container}>
        <View style={styles.field}>
          <Text>Nome do Cliente:</Text>
          <TextInput
            style={styles.textField}
            onChangeText={text => setCustomer({ ...customer, name: text })}
          ></TextInput>
        </View>
      </ScrollView>
      <SaveButton display={customer.name != ''} onClick={() => CreateCustomer()} />
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
    marginHorizontal: 20
  },
  textField: {
    backgroundColor: '#f5f5f5',
    width: 140,
    textAlign: 'right'
  }
});
