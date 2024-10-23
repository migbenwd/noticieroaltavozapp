/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/no-unstable-nested-components */

// migben - cambiar menu radical
// migben jueves - 08:20 am

import axios from 'axios';
import React, { useEffect, useState } from 'react';

import {
  CommonActions,
  createNavigationContainerRef,
  NavigationContainer,
  StackActions,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import TrackPlayer from 'react-native-track-player';

import { View, Text } from 'react-native';
import { OneSignal } from 'react-native-onesignal';

import HomeScreen from '../screens/HomeScreen';
import NewsDetails from '../screens/NewsDetails';
import WelcomeScreen from '../screens/WelcomeScreen';
import SplashScreens from '../screens/SplashScreens';
import RadioScreen from '../screens/RadioScreen';
import NewsDetailsMigben from '../screens/NewsDetailsMigben';

import { ApiRestURL } from '../services/NewsApi';

const navigationRef = createNavigationContainerRef();
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// TrackPlayer.registerPlaybackService(() => require('../../service'));
TrackPlayer.registerPlaybackService(() => require('../../service'));

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => {
          let iconName;

          if (route.name === 'Inicio') {
            iconName = 'home';
          } else if (route.name === 'Radio') {
            iconName = 'radio';
          }

          const customizeSize = 18;

          return (
            <View
              style={{
                // position: 'absolute',
                // marginTop: 120,
                // marginBottom: 100,
                marginVertical: 'center',
                borderRadius: 16,
                // padding: 10,
                width: 48,
                height: 46,
                alignItems: 'center',
                flexDirection: 'column',
                backgroundColor: focused ? 'blue' : 'transparent',
              }}
            >
              <Ionicons
                name={iconName}
                size={customizeSize}
                color={focused ? 'white' : 'gray'}
                marginTop={6}
              />

              <Text
                style={{
                  fontSize: 8,
                  color: focused ? 'white' : 'gray',
                }}
              >
                {route.name}
              </Text>
            </View>
          );
        },

        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',

        tabBarLabelStyle: {
          color: 'transparent',
        },

        tabBarStyle: {
          // backgroundColor: colorScheme == 'dark' ? 'black' : 'white',
          // backgroundColor: 'red',
          // height: 50,
          paddingTop: 30,
          paddingBottom: 30,
        },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Radio" component={RadioScreen} />
    </Tab.Navigator>
  );
}

OneSignal.initialize('8497271c-4edb-486f-a683-063bd6205b5b');

export default function AppNavigation() {
  const { colorScheme } = useColorScheme();
  const tituloCategoria = 'Portada';

  const [post, setPost] = useState(null);

  useEffect(() => {
    OneSignal.Notifications.addEventListener('click', (event) => {
      const notifix = event.notification.additionalData.post_url;
      console.log(notifix);

      const EnlaceURL = {
        link: notifix,
      };

      setPost(post);

      if (navigationRef.isReady()) {

        console.log('ESTA READY y el valor de post es: ');
        console.log(post);

        navigationRef.dispatch(
          CommonActions.navigate('NewsDetailsMigben', {
            item: EnlaceURL,
            tituloCategoria,
          })
        );
      }
    });
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="SplashS" component={SplashScreens} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="NewsDetails" component={NewsDetails} />
        <Stack.Screen name="NewsDetailsMigben" component={NewsDetailsMigben} />
        <Stack.Screen name="HomeTabs" component={TabNavigator} />
        <Stack.Screen name="RadioS" component={RadioScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

console.log('pasó por index.js de navigation');
