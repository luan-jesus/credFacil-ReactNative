import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Axios from 'axios';

import Header from '../../components/Header';
import LoadingScreen from '../../components/LoadingScreen';
import api from '../../services/api';

const CancelToken = Axios.CancelToken;
let cancel;

export default function Users({ navigation }) {
  const [user, setUser] = useState([]);
  const [filteredUser, setFilteredUser] = useState([]);
  const [loading, setLoading] = useState(true);

  function updateSearch(text) {
    var filtered = user.filter((value) => {
      return value.name.toLowerCase().indexOf(text.toLowerCase()) !== -1;
    });

    setFilteredUser(filtered);
  }

  useEffect(() => {
    setFilteredUser(user);
  }, [user]);

  async function loadData() {
    await api
      .get('/users', {
        cancelToken: new CancelToken(function executor(c) {
          // An executor function receives a cancel function as a parameter
          cancel = c;
        }),
      })
      .then((response) => setUser(...user, response.data))
      .catch((error) => {
        if (Axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          Alert.alert('Erro status: ' + error.response.status, error.response.data.error);
        }
      });
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <Header
        leftClick={() => {
          if (cancel) cancel();
        }}
        navigation={navigation}
        name="Usuários"
        rightButton="md-add"
        rightClick={() => navigation.navigate('UserNewScreen')}
      />
      <LoadingScreen loading={loading} />
      <View style={styles.filter}>
        <TextInput
          style={styles.textFilter}
          placeholder="Nome"
          onChangeText={(text) => updateSearch(text)}
        ></TextInput>
      </View>
      <ScrollView style={styles.CustomerList}>
        {filteredUser.map((val) => {
          return (
            <ItemList
              key={val.id}
              name={val.name}
              userId={val.id}
              authLevel={val.authLevel}
              navigation={navigation}
            />
          );
        })}
      </ScrollView>
    </>
  );
}

function authName(authLevel) {
  switch (authLevel) {
    case 1:
      return 'Motoboy';
      break;
    case 2:
      return 'Gerente';
      break;
  }
}

function ItemList({ name, userId, authLevel, navigation, refresh }) {
  return (
    <TouchableOpacity
      style={styles.itemList}
      onPress={() =>
        navigation.navigate('UserDetailScreen', { userId: userId })
      }
    >
      <View style={{ flexDirection: 'column' }}>
        <Text style={styles.itemName}>{name}</Text>
        <Text>{authName(authLevel)} </Text>
      </View>
      <Ionicons name="ios-arrow-round-forward" size={22} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  filter: {
    backgroundColor: '#ececec',
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  textFilter: {
    fontSize: 22,
  },
  CustomerList: {
    marginTop: 10,
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
    marginBottom: 5,
  },
});
