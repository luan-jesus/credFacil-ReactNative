import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native';
import { Text, StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import Header from '../../components/Header';
import LoadingScreen from '../../components/LoadingScreen';
import api from '../../services/api';

export default function MotoboyDetailScreen({ navigation, route }) {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    await api
      .get('/users/' + route.params?.userId)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => alert(error.message));

    setLoading(false);
  }

  return (
    <>
      <Header navigation={navigation} name="Motoboys" />
      <LoadingScreen loading={loading} />
      <ScrollView style={styles.container}>
        <View style={styles.field}>
          <Text>Id do Motoboy:</Text>
          <TextInput
            style={styles.textField}
            value={user?.id?.toString()}
            editable={false}
          ></TextInput>
        </View>
        <View style={styles.field}>
          <Text>Nome:</Text>
          <TextInput
            style={[styles.textField]}
            value={user?.name}
            editable={false}
          ></TextInput>
        </View>
        <View style={styles.field}>
          <Text>Total recebido Hoje:</Text>
          <TextInput
            style={styles.textField}
            value={user?.totalRecebido?.toFixed(2).replace('.', ',')}
            editable={false}
          ></TextInput>
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
    paddingHorizontal: 5,
  },
});
