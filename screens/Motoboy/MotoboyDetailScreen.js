import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Axios from "axios";

import Header from "../../components/Header";
import LoadingScreen from "../../components/LoadingScreen";
import TextField from "../../components/TextField";
import api from "../../services/api";

const CancelToken = Axios.CancelToken;
let cancel;

export default function MotoboyDetailScreen({ navigation, route }) {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    await api
      .get("/users/" + route.params?.userId, {
        cancelToken: new CancelToken(function executor(c) {
          // An executor function receives a cancel function as a parameter
          cancel = c;
        }),
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        if (Axios.isCancel(error)) {
          console.log("Request canceled", error.message);
        } else {
          Alert.alert(
            "Erro status: " + error.response.status,
            error.response.data.error
          );
        }
      });

    setLoading(false);
  }

  async function Receber() {
    setLoading(true);

    await api
      .post('/motoboy/' + route.params?.userId + "/receberTudo",
      {
        dataParcela: route.params?.dataParcela
      },
      {
        cancelToken: new CancelToken(function executor(c) {
          // An executor function receives a cancel function as a parameter
          cancel = c;
        }),
      })
      .then((response) => {
        navigation.navigate("Home");
      })
      .catch((error) => {
        if (Axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          Alert.alert('Erro status: ' + error.response.status, error.response.data.error);
          setLoading(false);
        }
      });    
  }

  function SaveChanges() {
    Alert.alert('Aviso', `Deseja receber ${parseFloat(user?.toReceive).toFixed(2).replace('.', ',')} do motoboy?`, [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      { text: 'OK', onPress: () => Receber() },
    ]);
  }

  const changeDateFormatTo = (date) => {
    if (date) {
      const [yy, mm, dd] = date.substring(0, 10).split(/-/g);
      return `${dd}/${mm}/${yy}`;
    }
  };

  const getDate = (date) => {
    if (date) {
      const formatedDate = changeDateFormatTo(date);
      const dateObj = new Date(date);
      switch (dateObj.getDay()) {
        case 0:
          return "Dom " + formatedDate;
        case 1:
          return "Seg " + formatedDate;
        case 2:
          return "Ter " + formatedDate;
        case 3:
          return "Qua " + formatedDate;
        case 4:
          return "Qui " + formatedDate;
        case 5:
          return "Sex " + formatedDate;
        case 6:
          return "Sab " + formatedDate;
      }
    }
  };

  return (
    <>
      <Header
        leftClick={() => {
          if (cancel) cancel();
        }}
        navigation={navigation}
        name="Motoboys"
      />
      <LoadingScreen loading={loading} />
      <ScrollView style={styles.container}>
        <TextField label="Id:" value={user.id?.toString()} editable={false} />
        <TextField label="Nome:" value={user?.name} editable={false} />
        <TextField
          label="A receber do motoboy:"
          value={
            user?.toReceive
              ? parseFloat(user?.toReceive).toFixed(2).replace(".", ",")
              : "0,00"
          }
          editable={false}
        />
        <TouchableOpacity
          style={[{ backgroundColor: user?.toReceive ? "#00910a" : "#aaaaaa"}, styles.confirmButtom]}
          onPress={SaveChanges}
          disabled={!user?.toReceive}
        >
          <Text style={styles.confirmText}>Receber tudo</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 16, marginBottom: 5 }}>Com o motoboy:</Text>
        {user?.historico?.map((hist) => (
          <TouchableOpacity
            style={styles.card}
            key={Math.random()}
            onPress={() =>
              navigation.navigate("MotoboyReceiveScreen", {
                userId: hist.userId,
                dataParcela: hist.date,
              })
            }
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 10,
              }}
            >
              <Text style={{ fontSize: 15 }}>
                {changeDateFormatTo(hist.date)}
              </Text>
              <Text style={{ fontSize: 15 }}>
                R$ {parseFloat(hist.valor).toFixed(2).replace(".", ",")}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[{ backgroundColor: "#0b33c1", marginVertical: 25 }, styles.confirmButtom]}
          onPress={() =>
            navigation.navigate('MotoboyHistScreen', { userId: route.params?.userId })
          }
        >
          <Text style={styles.confirmText}>Histórico</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 15,
    paddingHorizontal: 20,
  },
  card: {
    borderBottomColor: "gray",
    marginVertical: 5,
    marginHorizontal: 5,
    backgroundColor: "#f5f5f5",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  header: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ff9538",
  },
  headerText: {
    fontSize: 17,
    color: "#fff",
  },
  confirmButtom: {
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    zIndex: 9999,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    zIndex: 70,
  },
  confirmText: {
    color: "#fff",
    fontSize: 16,
  },
});
