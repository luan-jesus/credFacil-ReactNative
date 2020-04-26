import React, {useState, useEffect} from 'react';
import { Ionicons } from '@expo/vector-icons';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { Text, StyleSheet, View } from 'react-native';
import Axios from 'axios';

import Header from '../components/Header';
import api from '../services/api';
import LoadingScreen from '../components/LoadingScreen';

const CancelToken = Axios.CancelToken;
let cancel;

export default function Home({ navigation }) {

  const [solNum, setSolNum] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    await api
      .get('/emprestimos/solicitacao/count', {
        cancelToken: new CancelToken(function executor(c) {
          cancel = c;
        }),
      })
      .then((response) => {
        setSolNum(response.data.solicitacoes);
        console.log(response.data.solicitacoes)
        setLoading(false);
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
      <Header navigation={navigation} name="Inicio" />
      <LoadingScreen loading={loading} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <OptionButton
          icon="ios-contacts"
          label="Clientes"
          onPress={() => {
            navigation.navigate('Customers');
          }}
        />

        <OptionButton
          icon="ios-mail"
          label="Emprestimos Ativos"
          onPress={() => {
            navigation.navigate('LoansScreen');
          }}
        />

        <OptionButton
          icon="md-time"
          label="Histórico de Emprestimos"
          onPress={() => {
            navigation.navigate('LoansHistScreen');
          }}
        />

        <OptionButton
          icon="ios-bicycle"
          label="Motoboys"
          onPress={() => {
            navigation.navigate('MotoboysScreen');
          }}
        />

        <OptionButton
          icon="ios-body"
          label="Usuários"
          onPress={() => {
            navigation.navigate('UsersScreen');
          }}
        />

        <OptionButton
          icon="ios-book"
          label="Solicitações"
          onPress={() => {
            navigation.navigate('RequestScreen');
          }}
          number={solNum}
        />
      </ScrollView>
    </>
  );
}

function OptionButton({ icon, label, onPress, isLastOption, number }) {
  return (
    <RectButton
      style={[styles.option, isLastOption && styles.lastOption]}
      onPress={onPress}
    >
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.optionIconContainer}>
          <Ionicons name={icon} size={22} color="rgba(0,0,0,0.35)" />
        </View>
        <View style={styles.optionIconContainer}>
          <Text style={styles.optionText}>{label}</Text>
        </View>
        {number ? (
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <View style={{backgroundColor: '#ff9538', width: 20, height: 20, borderRadius: 50}}>
              <Text style={{color: '#fff', textAlign: 'center'}}>{number}</Text>
            </View>
          </View>
        ) : null}
      </View>
    </RectButton>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 15,
  },
  optionIconContainer: {
    marginRight: 12,
  },
  option: {
    backgroundColor: '#fdfdfd',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: '#ededed',
  },
  lastOption: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 15,
    alignSelf: 'flex-start',
    marginTop: 1,
  },
});
