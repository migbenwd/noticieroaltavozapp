/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/no-unstable-nested-components */

// migben - cambiar menu radical
// migben jueves - 08:20 am
// migben martes 9-dic - 07:02 pm - esta version tiene comentado el codigo de one signal y por ende, no funciona las push notifications

import React, { useEffect } from 'react';
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import TrackPlayer from 'react-native-track-player';

import { View, Text, Alert } from 'react-native';
// import { OneSignal } from 'react-native-onesignal';

import HomeScreen from '../screens/HomeScreen';
import NewsDetails from '../screens/NewsDetails';
import WelcomeScreen from '../screens/WelcomeScreen';
import SplashScreens from '../screens/SplashScreens';
import RadioScreen from '../screens/RadioScreen';

import PantallaDestino from '../screens/PantallaDestino';

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

export default function AppNavigation() {
  /*
  const tituloCategoria = 'Portada';
  OneSignal.initialize('8497271c-4edb-486f-a683-063bd6205b5b');
  useEffect(() => {
    OneSignal.Notifications.addEventListener('click', (event) => {
      const EnlaceURL = {
        link: event.notification.additionalData.post_url,
      };

      // Verifica y navega a la pantalla NewsDetails pasando los datos de la notificación
      if (navigationRef.isReady()) {
        navigationRef.current.navigate('NewsDetails', {
          item: EnlaceURL,
          tituloCategoria,
        });
      }
    });
    OneSignal.Notifications.addEventListener(
      'foregroundWillDisplay',
      (event) => {
        const data = {
          link: event.notification.additionalData.post_url,
          title: event.notification.title,
          description: event.notification.body,
        };

        const onPress = () => {
          if (!navigationRef.isReady()) return;
          navigationRef.current.navigate('NewsDetails', {
            item: data,
            tituloCategoria,
          });
        };

        Alert.alert('Nueva notificación', data.title, [
          {
            text: 'Ver noticia',
            onPress,
          },
          {
            text: 'Omitir',
            style: 'destructive',
          },
        ]);
      }
    );

    return () => {
      OneSignal.Notifications.removeEventListener('click');
      OneSignal.Notifications.removeEventListener('foregroundWillDisplay');
    };
  }, []);
  */

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="SplashS" component={SplashScreens} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="NewsDetails" component={NewsDetails} />
        <Stack.Screen name="PantallaDestino" component={PantallaDestino} />
        <Stack.Screen name="HomeTabs" component={TabNavigator} />
        <Stack.Screen name="RadioS" component={RadioScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

console.log('pasó por index dic - 29');
