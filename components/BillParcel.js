import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import { AsyncStorage } from "react-native";

import api from "../services/api";
import TextField from "./TextField";

export default function BillParcel({ parcel, beforeUpdate, afterUpdate }) {
  const [isOpened, setIsOpened] = useState(false);
  const [valorPago, setValorPago] = useState(0);

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

  function statusColor(status) {
    let x = "";
    switch (status) {
      case -1:
        x = "#f5f5f5";
        break;
      case 0:
        x = "#ffa1a1";
        break;
      case 1:
        x = "#f5f5f5";
        break;
      case 2:
        x = "#fdffa1";
        break;
      case 3:
        x = "#fdffa1";
        break;
    }
    return x;
  }

  function getStatus(status) {
    let x = "";
    switch (status) {
      case -1:
        x = "Andamento";
        break;
      case 0:
        x = "Não Pago";
        break;
      case 1:
        x = "Pago";
        break;
      case 2:
        x = "Pago com ressalvas";
        break;
      case 3:
        x = "Pago com atrasos";
        break;
    }
    return x;
  }

  function isToday() {
    return (
      changeDateFormatTo(new Date().toISOString()) ==
        changeDateFormatTo(parcel.dataParcela) && parcel.status == -1
    );
  }

  function isOutDated() {
    return new Date() > new Date(parcel.dataParcela) && !parcel.cobrado;
  }

  function pagarAtivo(valor, valorMax) {
    return valor > 0 && valor <= valorMax;
  }

  function SaveChanges() {
    Alert.alert(
      "Aviso",
      `Deseja receber ${valorPago.toFixed(2).replace(".", ",")} da parcela ${
        parcel.parcelaNum
      }?`,
      [
        { text: "Cancel", onPress: () => {}, style: "cancel" },
        { text: "OK", onPress: () => pagarParcela() },
      ]
    );
  }

  async function pagarParcela() {
    if (typeof beforeUpdate === "function") beforeUpdate(true);

    try {
      const loginId = await AsyncStorage.getItem("userId");

      await api
        .post("parcelas/" + parcel.id + "/receber", {
          valorPago: valorPago + parseFloat(parcel.valorPago),
          cobrado: true,
          userId: loginId,
        })
        .catch((error) => {
          Alert.alert(
            "Erro status: " + error.response.status,
            error.response.data.error
          );
        });
    } catch (error) {
      Alert.alert("Erro", error.message);
    }

    if (typeof afterUpdate === "function") afterUpdate();
  }

  return (
    <>
      {isToday() ? (
        <Text style={{ fontSize: 16 }}>Parcela de hoje:</Text>
      ) : isOutDated() ? (
        <Text style={{ fontSize: 16 }}>Parcela atrasada:</Text>
      ) : null}
      <TouchableOpacity
        style={[
          styles.parcelItem,
          isToday()
            ? { borderWidth: 5, borderColor: "#32a852" }
            : isOutDated()
            ? { borderWidth: 5, borderColor: "#ff0000" }
            : {},
        ]}
        onPress={() => {
          setIsOpened(!isOpened);
        }}
        disabled={parcel?.status !== -1}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>
            {parcel.parcelaNum} - {getDate(parcel.dataParcela)}
          </Text>
          <Text style={[styles.headerText, { textAlign: "right" }]}>
            R$
            {parcel.valorParcela
              ? parseFloat(parcel.valorParcela).toFixed(2).replace(".", ",")
              : "0,00"}
          </Text>
        </View>
        <View
          style={[styles.card, { backgroundColor: statusColor(parcel.status) }]}
        >
          {parcel.status == 1 ? (
            <>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginVertical: 3,
                }}
              >
                <Text style={styles.parcelText}>
                  <Text style={{ fontStyle: "italic" }}>Pago: </Text>R$
                  {parcel.valorPago
                    ? parseFloat(parcel.valorPago)?.toFixed(2).replace(".", ",")
                    : "0,00"}
                </Text>
                <Text style={styles.parcelText}>
                  {getStatus(parcel.status)}
                </Text>
              </View>
            </>
          ) : (
            <View>
              {parseFloat(parcel.valorPago) ? (
                <Text style={{ fontSize: 14 }}>
                  Ja foi pago:{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    R$
                    {parseFloat(parcel.valorPago).toFixed(2).replace(".", ",")}
                  </Text>{" "}
                  resta{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    R$
                    {(parseFloat(parcel.valorParcela) - parseFloat(parcel.valorPago)).toFixed(2).replace(".", ",")}
                  </Text>{" "}
                </Text>
              ) : null}
              {isOpened ? (
                <>
                  <View
                    style={{ flexDirection: "row", alignItems: "flex-end" }}
                  >
                    <TextField
                      editable={true}
                      label="Valor Pago:"
                      value={valorPago.toFixed(2).replace(".", ",")}
                      keyboardType="decimal-pad"
                      onChange={(val) =>
                        setValorPago(parseFloat(val.replace(",", "")) / 100)
                      }
                    />
                    <TouchableOpacity
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
                          pagarAtivo(
                            valorPago,
                            parseFloat(parcel.valorParcela) * 2
                          )
                            ? "#32a852"
                            : "#c6c6c6"
                        }
                      />
                    </TouchableOpacity>
                  </View>
                </>
              ) : null}
            </View>
          )}
        </View>
      </TouchableOpacity>
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
    marginVertical: 5,
    marginHorizontal: 5,
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
