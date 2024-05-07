/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/no-unstable-nested-components */

// migben - cambiar menu radical
// migben jueves - 08:20 am

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import TrackPlayer from 'react-native-track-player';

import { View, Text } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import NewsDetails from '../screens/NewsDetails';
import WelcomeScreen from '../screens/WelcomeScreen';
import SplashScreens from '../screens/SplashScreens';
import RadioScreen from '../screens/RadioScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// migben - note: 25-04-2024 - 11:13 am

TrackPlayer.registerPlaybackService(() => require('../../service'));

export default function AppNavigation() {
  const { colorScheme } = useColorScheme();
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

            const customizeSize = 22;

            return (
              <View
                style={{
                  // position: 'absolute',
                  marginTop: 12,
                  marginVertical: 'center',
                  borderRadius: 5,
                  padding: 5,
                  height: 45,
                  alignItems: 'center',
                  backgroundColor: focused ? 'blue' : 'transparent',
                }}
              >
                <Ionicons
                  name={iconName}
                  size={customizeSize}
                  color={focused ? 'white' : 'gray'}
                />

                <Text
                  style={{
                    fontSize: 12,
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
            backgroundColor: colorScheme == 'dark' ? 'black' : 'white',
          },
        })}
      >
        <Tab.Screen name="Inicio" component={HomeScreen} />
        <Tab.Screen name="Radio" component={RadioScreen} />
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        // initialRouteName="SplashS"
        // initialRouteName="RadioS"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="SplashS" component={SplashScreens} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="NewsDetails" component={NewsDetails} />
        <Stack.Screen name="HomeTabs" component={TabNavigator} />
        <Stack.Screen name="RadioS" component={RadioScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

console.log('pasó por index.js de navigation');
