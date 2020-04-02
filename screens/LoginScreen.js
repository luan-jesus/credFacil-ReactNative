import React, { useState } from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  Text
} from 'react-native';

import GeneralStatusBarColor from '../components/GeneralStatusBarColorStyles';
import LoadingScreen from '../components/LoadingScreen';

export default function Login({ navigation }) {
  const [user, setUser] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  async function Login() {
    setLoading(true);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    };

    let apireq = await fetch(
      'http://192.168.0.2:5000/auth/login',
      requestOptions
    ).catch(e => alert(e.message));

    //console.log(apireq);
    if (apireq.status === 401) {
      // Unauthorized
      alert('Usuário ou senha incorretos');
    } else if (apireq.status === 200) {
      navigation.navigate('Home');
    }
    setLoading(false);
  }

  return (
    <>
      <GeneralStatusBarColor backgroundColor="#fff" barStyle="dark-content" />
      <LoadingScreen loading={loading}/>
      <View style={styles.header}>
        <Text style={styles.title}>
          <Text style={{ color: '#02983e' }}>Cred</Text>
          <Text style={{ color: '#eb8018' }}>Fácil</Text>
        </Text>
      </View>
      <View style={styles.container}>
        <TextInput
          style={styles.textBox}
          placeholder="Usuário"
          onChangeText={text => setUser({ ...user, username: text })}
        ></TextInput>
        <TextInput
          style={styles.textBox}
          placeholder="Senha"
          secureTextEntry={true}
          onChangeText={text => setUser({ ...user, password: text })}
        ></TextInput>
        <TouchableOpacity style={styles.btn} onPress={() => Login()}>
          <Text style={styles.btnLabel}>Login</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    position: 'absolute',
    zIndex: 99,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'none'
  },
  header: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    marginBottom: -70,
    backgroundColor: '#ffffff',
    height: 200
  },
  container: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#ffffff'
  },

  logo: {
    width: 120,
    height: 120
  },

  title: {
    fontSize: 54,
    fontWeight: 'bold',
    marginBottom: 60
  },

  textBox: {
    fontSize: 16,
    padding: 15,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: '#ececec',
    width: 300
  },

  btn: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#ff9538',
    width: 150,
    height: 50,
    borderRadius: 5,
    marginTop: 20
  },
  btnLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18
  }
});
