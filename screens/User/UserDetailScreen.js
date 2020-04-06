import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ModalDropdown from 'react-native-modal-dropdown';
import Axios from 'axios';

import Header from '../../components/Header';
import LoadingScreen from '../../components/LoadingScreen';
import SaveButton from '../../components/SaveButton';
import TextField from '../../components/TextField';
import api from '../../services/api';

const CancelToken = Axios.CancelToken;
let cancel;

export default function CustomerDetailScreen({ navigation, route }) {
  const [user, setUser] = useState([]);
  const [originalUser, setOriginalUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    console.log(user);
    console.log(originalUser);
    if (
      user.id &&
      user.username &&
      user.name &&
      user.password &&
      user.authLevel &&
      originalUser.id &&
      originalUser.username &&
      originalUser.name &&
      originalUser.password &&
      originalUser.authLevel
    ) {
      if (
        user.id !== originalUser.id ||
        user.username !== originalUser.username ||
        user.name !== originalUser.name ||
        user.password !== originalUser.password ||
        user.authLevel !== originalUser.authLevel
      ) {
        setIsEditMode(true);
      } else {
        setIsEditMode(false);
      }
    }
  }, [user, originalUser]);

  async function loadData() {
    await api
      .get('/users/' + route.params?.userId, {
        cancelToken: new CancelToken(function executor(c) {
          // An executor function receives a cancel function as a parameter
          cancel = c;
        }),
      })
      .then((response) => {
        setUser(response.data);
        setOriginalUser(response.data);
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
      .delete('/users/' + route.params?.userId, {
        cancelToken: new CancelToken(function executor(c) {
          // An executor function receives a cancel function as a parameter
          cancel = c;
        }),
      })
      .then(() => {
        Alert.alert('Sucesso', 'Usuário deletado com sucesso!');
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
      .put('/users/', user, {
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
        leftClick={() => {cancel()}}
        navigation={navigation}
        name="Usuários"
        rightButton="ios-trash"
        rightClick={() => DeleteRecord()}
      />
      <LoadingScreen loading={loading} />
      <ScrollView style={styles.container}>
        <TextField label="Id:" value={user.id?.toString()} editable={false} />
        <TextField
          label="Nome:"
          value={user.name}
          editable={true}
          onChange={(text) => setUser({ ...user, name: text })}
        />
        <TextField
          label="Usuário:"
          value={user.username}
          editable={true}
          onChange={(text) => setUser({ ...user, username: text })}
        />
        <TextField
          label="Senha:"
          value={user.password}
          editable={true}
          onChange={(text) => setUser({ ...user, password: text })}
        />
        <View style={styles.field}>
          <Text style={styles.title}>Cargo:</Text>
          <ModalDropdown
            style={styles.dropdown}
            textStyle={{ fontSize: 15 }}
            dropdownStyle={styles.dropdownStyle}
            dropdownTextStyle={{ fontSize: 15 }}
            options={['Motoboy', 'Gerente']}
            defaultValue={user.authLevel == 1 ? 'Motoboy' : 'Gerente'}
            onSelect={(index) =>
              setUser({ ...user, authLevel: parseInt(index) + 1 })
            }
          />
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
    paddingHorizontal: 20
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
