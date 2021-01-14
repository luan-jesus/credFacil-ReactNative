import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View, Text } from 'react-native';
import { SplashScreen } from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, Assets } from '@react-navigation/stack';

import Login from './screens/LoginScreen';
import Home from './screens/HomeScreen';

import ParcelsScreen from './screens/Parcel/ParcelsScreen';
import ParcelHistScreen from './screens/Parcel/ParcelHistScreen';
import ParcelDetailScreen from './screens/Parcel/ParcelDetailScreen';
import ParcelBillScreen from './screens/Parcel/ParcelBillScreen';

import Customers from './screens/Customer/CustomersScreen';
import CustomerDetailScreen from './screens/Customer/CustomerDetailScreen';
import CustomerNewScreen from './screens/Customer/CustomerNewScreen';

import RequestScreen from './screens/Request/RequestScreen';
import RequestAcceptScreen from './screens/Request/RequestAcceptScreen';

import LoansScreen from './screens/Loan/LoansScreen.js';
import LoansHistScreen from './screens/Loan/LoansHistScreen.js';
import LoanDetailScreen from './screens/Loan/LoanDetailScreen';
import LoanNewScreen from './screens/Loan/LoanNewScreen';

import MotoboysScreen from './screens/Motoboy/MotoboysScreen';
import MotoboyDetailScreen from './screens/Motoboy/MotoboyDetailScreen';
import MotoboyHistScreen from './screens/Motoboy/MotoboyHistScreen';
import MotoboyReceiveScreen from './screens/Motoboy/MotoboyReceiveScreen';
import MotoboyHistDetailScreen from './screens/Motoboy/MotoboyHistDetailScreen';

import UsersScreen from './screens/User/UsersScreen';
import UserDetailScreen from './screens/User/UserDetailScreen';
import UserNewScreen from './screens/User/UserNewScreen';

const Stack = createStackNavigator();

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  //const containerRef = React.useRef();
  //const { getInitialState } = useLinking(containerRef);

  

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

        // Load our initial navigation state
        //setInitialNavigationState(await getInitialState());

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
          'Montserrat-Regular': require('./assets/fonts/Montserrat-Regular.ttf'),
          'Montserrat-ExtraBoldItalic' : require('./assets/fonts/Montserrat-ExtraBoldItalic.ttf')
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <NavigationContainer initialState={initialNavigationState}>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerShown: false
            }}
          >
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="ParcelsScreen" component={ParcelsScreen} />
            <Stack.Screen name="ParcelBillScreen" component={ParcelBillScreen} />
            <Stack.Screen name="ParcelHistScreen" component={ParcelHistScreen} />
            <Stack.Screen name="ParcelDetailScreen" component={ParcelDetailScreen} />
            <Stack.Screen name="Customers" component={Customers} />
            <Stack.Screen name="CustomerDetailScreen" component={CustomerDetailScreen}/>
            <Stack.Screen name="CustomerNewScreen" component={CustomerNewScreen}/>
            <Stack.Screen name="RequestScreen" component={RequestScreen}/>
            <Stack.Screen name="RequestAcceptScreen" component={RequestAcceptScreen}/>
            <Stack.Screen name="LoansScreen" component={LoansScreen}/>
            <Stack.Screen name="LoansHistScreen" component={LoansHistScreen}/>
            <Stack.Screen name="LoanDetailScreen" component={LoanDetailScreen}/>
            <Stack.Screen name="LoanNewScreen" component={LoanNewScreen}/>
            <Stack.Screen name="MotoboysScreen" component={MotoboysScreen}/>
            <Stack.Screen name="MotoboyDetailScreen" component={MotoboyDetailScreen}/>
            <Stack.Screen name="MotoboyHistScreen" component={MotoboyHistScreen}/>
            <Stack.Screen name="MotoboyReceiveScreen" component={MotoboyReceiveScreen}/>
            <Stack.Screen name="MotoboyHistDetailScreen" component={MotoboyHistDetailScreen}/>
            <Stack.Screen name="UsersScreen" component={UsersScreen}/>
            <Stack.Screen name="UserDetailScreen" component={UserDetailScreen}/>
            <Stack.Screen name="UserNewScreen" component={UserNewScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
