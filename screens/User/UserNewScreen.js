import React, { useState } from 'react';
import { Text, StyleSheet, View, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';
import Axios from 'axios';

import Header from '../../components/Header';
import api from '../../services/api';
import LoadingScreen from '../../components/LoadingScreen';
import SaveButton from '../../components/SaveButton';
import TextField from '../../components/TextField';

const CancelToken = Axios.CancelToken;
let cancel;

export default function CustomerNewScreen({ navigation }) {
  const [user, setUser] = useState({
    name: '',
    username: '',
    password: '',
    authLevel: 1,
  });
  const [loading, setLoading] = useState(false);

  function CreateUser() {
    Alert.alert('Alerta', 'Deseja prosseguir com a criação do registro?', [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      { text: 'OK', onPress: () => PostCreate() },
    ]);
  }

  async function PostCreate() {
    setLoading(true);
    await api
      .post('/users', user, {
        cancelToken: new CancelToken(function executor(c) {
          // An executor function receives a cancel function as a parameter
          cancel = c;
        }),
      })
      .then(() => {
        Alert.alert('Sucesso', 'Usuário criado com sucesso!');
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
        name="Usuários"
      />
      <LoadingScreen loading={loading} />
      <ScrollView style={styles.container}>
        <TextField
          label="Nome:"
          value={user.name}
          onChange={(text) => setUser({ ...user, name: text })}
          editable={true}
        />
        <TextField
          label="Usuário:"
          value={user.username}
          onChange={(text) => setUser({ ...user, username: text })}
          editable={true}
        />
        <TextField
          label="Senha:"
          value={user.password}
          onChange={(text) => setUser({ ...user, password: text })}
          editable={true}
        />
        <View style={styles.field}>
          <Text style={styles.title}>Cargo:</Text>
          <RNPickerSelect
            onValueChange={(value) => setUser({ ...user, authLevel: value })}
            value={user.authLevel}
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
            placeholder={{ label: 'Selecione um cargo' }}
            items={[
              { label: 'Motoboy', value: 1 },
              { label: 'Gerente', value: 2 },
            ]}
          />
        </View>
      </ScrollView>
      <SaveButton
        display={
          user.name !== '' && user.username !== '' && user.password !== ''
        }
        onClick={() => CreateUser()}
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
  field: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  title: {
    fontSize: 16,
    marginBottom: 5,
  },
  dropdown: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  dropdownStyle: {
    marginTop: -20,
    left: 0,
    right: 30,
  },
});
