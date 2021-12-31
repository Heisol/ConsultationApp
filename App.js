/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  View
} from 'react-native';
// package imports

import CovidConsultation from './Screens/CovidConsultation';
import Tips from './Screens/Tips';
// local imports

const App = () => {
  return (
    <View>
      <StatusBar hidden={true} />
      {/* <CovidConsultation /> */}
      <Tips/>
    </View>
  );
};


export default App;
