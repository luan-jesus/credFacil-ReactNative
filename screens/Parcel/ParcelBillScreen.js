import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View, Alert, Text, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { AsyncStorage } from 'react-native';
import Axios from "axios";

import Header from "../../components/Header";
import LoadingScreen from "../../components/LoadingScreen";
import BillParcel from "../../components/BillParcel";
import TextField from "../../components/TextField";
import api from "../../services/api";

const CancelToken = Axios.CancelToken;
let cancel;

export default function LoanDetailScreen({ navigation, route }) {
  const [loan, setLoan] = useState([]);
  const [parcels, setParcels] = useState([]);
  const [valorPago, setValorPago] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    await api
      .get("/emprestimos/" + route.params?.loanId, {
        cancelToken: new CancelToken(function executor(c) {
          cancel = c;
        }),
      })
      .then((response) => {
        console.log(response.data);
        setLoan(response.data);
        setParcels(response.data.parcelas);
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

  function SaveChanges() {
    Alert.alert('Aviso', `Deseja receber ${valorPago.toFixed(2).replace(".", ",")} do emprestimo ${loan.id}?`, [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      { text: 'OK', onPress: () => pagarParcela() },
    ]);
  }

  async function pagarParcela() {

    setLoading(true);

    try {
      const loginId = await AsyncStorage.getItem('userId');

      await api.post("emprestimos/" + loan.id + "/pagar", {
        valorPago,
        userId: loginId
      }).catch(error => {
        Alert.alert('Erro status: ' + error.response.status, error.response.data.error);
      })

    } catch (error) {
      Alert.alert('Erro', error.message);
    }
    
    navigation.navigate("Login");
  }

  function pagarAtivo(valor, valorMax) {
    return valor > 0 && valor <= valorMax;
  }

  return (
    <>
      <Header
        leftClick={() => {
          if (cancel) cancel();
        }}
        navigation={navigation}
        name="Cobrar Emprestimo"
      />
      <LoadingScreen loading={loading} />
      <ScrollView style={styles.container}>
        <TextField
          label="Cliente:"
          value={loan?.cliente?.name}
          editable={false}
        />
        <TextField
          label="Emprestimo:"
          value={loan.id?.toString()}
          editable={false}
        />
        <View style={{ flexDirection: "row" }}>
          <TextField
            label="Valor a receber hoje:"
            value={
              loan.qtdAReceber
                ? parseFloat(loan.qtdAReceber)?.toFixed(2).replace(".", ",")
                : "0,00"
            }
            editable={false}
          />
          <View style={{ width: 20 }}></View>
          <TextField
            label="Parcelas acumuladas:"
            value={loan.numParcelasAReceber + ""}
            editable={false}
          />
        </View>
        <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
          <TextField
            label="Valor pago:"
            value={valorPago.toFixed(2).replace(".", ",")}
            editable={true}
            keyboardType="decimal-pad"
            onChange={(val) =>
              setValorPago(parseFloat(val.replace(",", "")) / 100)
            }
          />
          <TouchableOpacity
            disabled={!pagarAtivo(valorPago, (parseFloat(loan?.valorAReceber) - parseFloat(loan?.valorPago)))}
            style={{
              paddingHorizontal: 10,
              marginHorizontal: 5,
              marginVertical: 10,
            }}
            onPress={SaveChanges}
          >
            <Ionicons
              name="ios-checkmark-circle"
              size={48}
              color={
                pagarAtivo(valorPago, (parseFloat(loan?.valorAReceber) - parseFloat(loan?.valorPago)))
                  ? "#32a852"
                  : "#c6c6c6"
              }
            />
          </TouchableOpacity>
        </View>
        <View style={styles.parcels}>
          <Text style={styles.title}>Parcelas:</Text>
          {parcels.map((parcel) => (
            <BillParcel parcel={parcel} key={parcel.parcelaNum} beforeUpdate={setLoading} afterUpdate={loadData} />
          ))}
        </View>
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
  parcels: {
    marginTop: 5,
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    marginBottom: 5,
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
  parcelItem: {
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
  card: {
    paddingTop: 3,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  parcelText: {
    fontSize: 15,
  },
});
