import * as WebBrowser from 'expo-web-browser';
import { Linking } from 'react-native';

export async function openInBrowser(url, options = {}) {
  try {
    if (!/^https?:\/\//.test(url)) throw new Error('No http');

    await WebBrowser.openBrowserAsync(url, options);
  } catch (err) {
    Linking.openURL(url);
  }
}
