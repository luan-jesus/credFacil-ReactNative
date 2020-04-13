import React, { useState, useEffect } from 'react';
import { TextInput } from 'react-native';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Axios from 'axios';

import Header from '../../components/Header';
import LoadingScreen from '../../components/LoadingScreen';
import api from '../../services/api';

const CancelToken = Axios.CancelToken;
let cancel;

export default function ParcelsScreen({ navigation }) {
  const [parcels, setParcels] = useState([]);
  const [filteredParcels, seFilteredtParcels] = useState([]);
  const [loading, setLoading] = useState(true);

  function updateSearch(text) {
    var filtered = parcels.filter((parcel) => {
      return (
        parcel?.emprestimo?.cliente?.name
          .toLowerCase()
          .indexOf(text.toLowerCase()) !== -1
      );
    });

    seFilteredtParcels(filtered);
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('refresh the page');
      // The screen is focused
      // Call any action
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);


  useEffect(() => {
    seFilteredtParcels(parcels);
  }, [parcels]);

  useEffect(() => {
    async function loadData() {
      await api
        .get('/parcelas/today', {
          cancelToken: new CancelToken(function executor(c) {
            // An executor function receives a cancel function as a parameter
            cancel = c;
          }),
        })
        .then((response) => setParcels(...parcels, response.data))
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
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <>
      <Header
        leftClick={() => {
          if (cancel) cancel();
        }}
        navigation={navigation}
        name="Parcelas a cobrar"
      />
      <LoadingScreen loading={loading} />
      <View style={styles.filter}>
        <TextInput
          style={styles.textFilter}
          placeholder="Cliente"
          onChangeText={(text) => updateSearch(text)}
        ></TextInput>
      </View>
      <ScrollView style={styles.CustomerList}>
        {filteredParcels.map((parcel) => (
          <TouchableOpacity
            key={parcel?.parcelaNum}
            style={styles.parcelItem}
            onPress={() =>
              navigation.navigate('ParcelBillScreen', { parcelId: parcel?.id })
            }
          >
            <View style={styles.header}>
              <Text style={styles.headerText}>
                {parcel?.emprestimo?.cliente?.name}
              </Text>
              <Text style={[styles.headerText, { textAlign: 'right' }]}>
                Parcela: {parcel?.parcelaNum}
              </Text>
            </View>
            <View style={styles.card}>
              <View style={{flexDirection: 'row', flex: 1}}>
                <Text style={styles.cardLabel}>Valor a ser cobrado: </Text>
                <Text style={[styles.cardLabel, { textAlign: 'right' }]}>
                  R$
                  {parcel?.valorParcela
                    ? parseFloat(parcel?.valorParcela)
                        ?.toFixed(2)
                        .replace('.', ',')
                    : '0,00'}
                </Text>
              </View>
              <Text style={{fontStyle: 'italic'}}>(Clique sobre a parcela para cobra-la)</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
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
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#adadad',
    marginBottom: 10,
    marginHorizontal: 5,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
  },
  header: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ff9538',
  },
  headerText: {
    fontSize: 20,
    color: '#fff',
  },
  parcelItem: {
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
  card: {
    paddingTop: 3,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  parcelText: {
    fontSize: 15,
  },
  cardLabel: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 15,
    flex: 1
  }
});
