/**
 * @format
 */

import { AppRegistry } from 'react-native';
// import App from "./App";
import AppScreen from './src/MainScreen';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => AppScreen);
