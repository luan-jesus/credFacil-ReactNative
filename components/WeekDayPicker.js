import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function ({ value, dayName, onChange, display }) {
  var defaultValue = {
    "0": false,
    "1": false,
    "2": false,
    "3": false,
    "4": false,
    "5": false,
    "6": false,
  };
  var defaultDayName = {
    "0": 'Dom',
    "1": 'Seg',
    "2": 'Ter',
    "3": 'Qua',
    "4": 'Qui',
    "5": 'Sex',
    "6": 'Sab',
  };

  function onPress (day) {
    if (value) {
      var newValues = value;
    } else {
      var newValues = defaultValue
    }
    newValues[day] = !newValues[day]
    if (typeof onChange === 'function') {
      onChange({
        "0": newValues[0],
        "1": newValues[1],
        "2": newValues[2],
        "3": newValues[3],
        "4": newValues[4],
        "5": newValues[5],
        "6": newValues[6],
      })
    }
  }

  return (typeof display === 'undefined' ? true : display) ? (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.dayItem,
          (value ? value[0] : defaultValue[0]) ? styles.selected : null,
        ]}
        onPress={() => onPress(0)}
      >
        <Text style={styles.TextStyle}>{dayName ? dayName[0] : defaultDayName[0]}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.dayItem,
          (value ? value[1] : defaultValue[1]) ? styles.selected : null,
        ]}
        onPress={() => onPress(1)}
      >
        <Text style={styles.TextStyle}>{dayName ? dayName[1] : defaultDayName[1]}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.dayItem,
          (value ? value[2] : defaultValue[2]) ? styles.selected : null,
        ]}
        onPress={() => onPress(2)}
      >
        <Text style={styles.TextStyle}>{dayName ? dayName[2] : defaultDayName[2]}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.dayItem,
          (value ? value[3] : defaultValue[3]) ? styles.selected : null,
        ]}
        onPress={() => onPress(3)}
      >
        <Text style={styles.TextStyle}>{dayName ? dayName[3] : defaultDayName[3]}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.dayItem,
          (value ? value[4] : defaultValue[4]) ? styles.selected : null,
        ]}
        onPress={() => onPress(4)}
      >
        <Text style={styles.TextStyle}>{dayName ? dayName[4] : defaultDayName[4]}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.dayItem,
          (value ? value[5] : defaultValue[5]) ? styles.selected : null,
        ]}
        onPress={() => onPress(5)}
      >
        <Text style={styles.TextStyle}>{dayName ? dayName[5] : defaultDayName[5]}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.dayItem,
          (value ? value[6] : defaultValue[6]) ? styles.selected : null,
        ]}
        onPress={() => onPress(6)}
      >
        <Text style={styles.TextStyle}>{dayName ? dayName[6] : defaultDayName[6]}</Text>
      </TouchableOpacity>
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayItem: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 50,
    alignItems: 'center',
    flexDirection: 'row',
  },
  TextStyle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
  },
  selected: {
    backgroundColor: '#ff9538',
  },
});
