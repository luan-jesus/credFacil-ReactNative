import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { Text, StyleSheet, View } from 'react-native';

import Header from '../components/Header';

export default function Home({ navigation }) {
  return (
    <>
      <Header navigation={navigation} name="Inicio" />
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
      </ScrollView>
    </>
  );
}

function OptionButton({ icon, label, onPress, isLastOption }) {
  return (
    <RectButton
      style={[styles.option, isLastOption && styles.lastOption]}
      onPress={onPress}
    >
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.optionIconContainer}>
          <Ionicons name={icon} size={22} color="rgba(0,0,0,0.35)" />
        </View>
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionText}>{label}</Text>
        </View>
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
