# react-native-nearby-api [![npm version](https://badge.fury.io/js/react-native-nearby-api.svg)](https://badge.fury.io/js/react-native-nearby-api)

## Getting started

`$ yarn add react-native-nearby-api` or `$ npm install react-native-nearby-api --save`

### Installation

This package supports Autolinking for React Native 0.60 and above.

#### iOS

- ```
  cd ios/
  pod install
  ```
- Build and run project

#### Android

There are no additional steps required for Android

## Usage

See the
[example app](https://github.com/badfeatures/react-native-nearby-api/tree/master/example) for more detail and code examples.

- Retrieve your API Keys from the Google Console [iOS](https://developers.google.com/nearby/messages/ios/get-started) | [Android](https://developers.google.com/nearby/messages/android/get-started)
- Add the correct permissions to the AndroidManifest.

  ```xml
  <!-- Include if wish to use BLE -->
  <uses-permission android:name="android.permission.BLUETOOTH"/>
  <uses-permission android:name="android.permission.BLUETOOTH_ADMIN"/>
  <!-- Include if wish to use audio -->
  <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
  <uses-permission android:name="android.permission.RECORD_AUDIO" />
  ```

- Add the Android API Key in the AndroidManifest .

  ```xml
  <meta-data
    android:name="com.google.android.nearby.messages.API_KEY"
    android:value="MY_API_KEY" />
  ```

- The iOS API key will be supplied through the `connect()` method.
- Add `NSBluetoothPeripheralUsageDescription` to the Info.plist
- Add `NSMicrophoneUsageDescription` to the iOS project's Info.plist _if using audio_

```javascript
import NearbyApi from 'react-native-nearby-api';

const nearbyAPI = new NearbyAPI(true); // Use BLE only, no audio.
nearbyAPI.onConnected(message => {
  console.log(message);
});
nearbyAPI.onDisconnected(message => {
  console.log(message);
});
nearbyAPI.onFound(message => {
  console.log('Message Found!');
  console.log(message);
});
nearbyAPI.onLost(message => {
  console.log('Message Lost!');
  console.log(message);
});
// Android Only
nearbyAPI.onDistanceChanged((message, value) => {
  console.log('Distance Changed!');
  console.log(message, value);
});
// Android Only
nearbyAPI.onBLESignalChanged((message, value) => {
  console.log('BLE Signal Changed!');
  console.log(message, value);
});
nearbyAPI.onPublishSuccess(message => {
  console.log(message);
});
nearbyAPI.onPublishFailed(message => {
  console.log(message);
});
nearbyAPI.onSubscribeSuccess(() => {});
nearbyAPI.onSubscribeFailed(() => {});

// To connect from Google API Client
nearbyAPI.connect(API_KEY);

// To check if the nearby API is connected.
nearbyAPI.isConnected((connected, error) => {
  console.log(connected);
});

// To disconnect later
nearbyAPI.disconnect();

// To publish to nearby devices
nearbyAPI.publish('Hello World!');

// To check if the nearby API is publishing.
nearbyAPI.isPublishing((publishing, error) => {
  console.log(publishing);
});

// To subscribe to nearby devices broadcasting
nearbyAPI.subscribe();

// To check if the nearby API is subscribing.
nearbyAPI.isSubscribing((subscribing, error) => {
  console.log(subscribing);
});

// To unpublish
nearbyAPI.unpublish();

// To unsubscribe
nearbyAPI.unsubscribe();
```

## Running the Example

- Install the dependencies in the root folder

  `yarn`

#### Generate an API Key from the [Google Developer Console](https://console.developers.google.com/flows/enableapi?apiid=copresence&keyType=CLIENT_SIDE_ANDROID&reusekey=true)

1. Go to the Google Developers Console.
2. Create or select a project to register your application with.
3. Click Continue to Enable the API.
4. On the Credentials page, create a new API Key. (No key restrictions are needed for this example)
5. Copy/Paste your key in [example/index.js](https://github.com/badfeatures/react-native-nearby-api/blob/develop/example/App.js#L26) and in the example [AndroidManifest.xml](https://github.com/badfeatures/react-native-nearby-api/blob/develop/example/android/app/src/main/AndroidManifest.xml#L31)

#### Android

- To run the example app, the packager must have the `projectRoots` reordered
  for the example/ directory. In another terminal window:

`yarn start --projectRoots <FULL-PATH-TO-REPO>/react-native-nearby-api/example,<FULL-PATH-TO-REPO>/react-native-nearby-api`

`yarn run:android`

`adb reverse tcp:8081 tcp:8081`

#### iOS

- `cd example ios/`
- `bundle exec pod install`
- Open `example.xcworkspace`
- Add your IP to `AppDelegate.m`

```objective-c
  jsCodeLocation = [NSURL URLWithString:@"http://<IP-ADDRESS>:8081/index.bundle?platform=ios&dev=true"];
```

- In another terminal window: `yarn start`
- Run on device

  NOTE: If you receive a `duplicate symbols for architecture` error through Xcode, this is a [known issue](https://github.com/facebook/react-native/issues/16406). A work around is to run `./renameLogger.sh` after `node_modules` have been installed and you've attempted to run in Xcode.
