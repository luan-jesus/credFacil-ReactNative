import React, { useState } from 'react';
import { TextInput } from 'react-native';
import { Text, StyleSheet, View, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ModalDropdown from 'react-native-modal-dropdown';

import Header from '../../components/Header';
import api from '../../services/api';
import LoadingScreen from '../../components/LoadingScreen';
import SaveButton from '../../components/SaveButton';
import TextField from '../../components/TextField';

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
      .post('/users', user)
      .then(() => {
        Alert.alert('Sucesso', 'Cliente criado com sucesso!');
        navigation.navigate('Home');
      })
      .catch((error) => {
        Alert.alert('Erro', error.message);
        setLoading(false);
      });
  }

  return (
    <>
      <Header navigation={navigation} name="Usuários" />
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
          <ModalDropdown
            style={styles.dropdown}
            textStyle={{fontSize: 15}}
            dropdownStyle={styles.dropdownStyle}
            dropdownTextStyle={{fontSize: 15}}
            options={['Motoboy', 'Gerente']}
            defaultValue={'Motoboy'}
            onSelect={(index) =>
              setUser({ ...user, authLevel: parseInt(index) + 1 })
            }
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
  },
  field: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 16,
    marginBottom: 5
  },
  dropdown: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5
  },
  dropdownStyle: {
    marginTop: -20,
    left: 0,
    right: 30
  }
});
