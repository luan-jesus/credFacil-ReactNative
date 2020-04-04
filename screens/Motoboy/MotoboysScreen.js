import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import Header from '../../components/Header';
import LoadingScreen from '../../components/LoadingScreen';
import api from '../../services/api';


export default function Motoboys({ navigation }) {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      await api.get('/users/motoboys')
        .then(response => setUser(...user, response.data))
        .catch(error => alert(error.message));
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <>
      <Header navigation={navigation} name="Motoboys"/>
      <LoadingScreen loading={loading}/>
      <View style={styles.filter}>
        <TextInput style={styles.textFilter} placeholder="Nome"></TextInput>
      </View>
      <ScrollView style={styles.CustomerList}>
        {user.map(val => {
          return (
            <ItemList key={val.id} name={val.name} userId={val.id} receivedToday={val.receivedToday} navigation={navigation}/>
          );
        })}
      </ScrollView>
    </>
  );
}

function ItemList({ name, userId, receivedToday, navigation }) {
  return (
    <TouchableOpacity style={styles.itemList} onPress={() => navigation.navigate('MotoboyDetailScreen', { userId: userId })}  >
      <View style={{flexDirection: 'column'}}>
        <Text style={styles.itemName}>{name}</Text>
        <Text>Recebeu Hoje: R$ {receivedToday ? receivedToday.toFixed(2).replace('.', ',') : '0,00'} </Text>
      </View>
      <Ionicons name="ios-arrow-round-forward" size={22} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  filter: {
    backgroundColor: '#ececec',
    paddingHorizontal: 5,
    paddingVertical: 10
  },
  textFilter: {
    fontSize: 22
  },
  CustomerList: {
    marginTop: 10
  },
  itemList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#adadad',
    marginBottom: 10,
    marginHorizontal: 5,
  },
  itemName: {
    fontSize: 20,
    marginBottom: 5
  }
});
