import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native';
import { Text, StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import Header from '../../components/Header';
import LoadingScreen from '../../components/LoadingScreen';
import TextField from '../../components/TextField'; 
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
        <TextField
          label="Id:"
          value={user.id?.toString()}
          editable={false}
        />
        <TextField
          label="Nome:"
          value={user?.name}
          editable={false}
        />
        <TextField
          label="Total recebido Hoje:"
          value={user.totalRecebido ? user.totalRecebido?.toFixed(2).replace('.', ',') : '0,00'}
          editable={false}
        />
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
});
