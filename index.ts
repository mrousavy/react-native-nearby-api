"use strict";
import {
  Platform,
  NativeModules,
  DeviceEventEmitter,
  NativeEventEmitter,
  DeviceEventEmitterStatic,
  EmitterSubscription
} from "react-native";

const { RNNearbyApi } = NativeModules;

/**
 * Event Constants
 */
export const CONNECTED = "CONNECTED";
export const CONNECTION_SUSPENDED = "CONNECTION_SUSPENDED";
export const CONNECTION_FAILED = "CONNECTION_FAILED";
export const DISCONNECTED = "DISCONNECTED";
export const MESSAGE_FOUND = "MESSAGE_FOUND";
export const MESSAGE_LOST = "MESSAGE_LOST";
export const DISTANCE_CHANGED = "DISTANCE_CHANGED";
export const BLE_SIGNAL_CHANGED = "BLE_SIGNAL_CHANGED";
export const PUBLISH_SUCCESS = "PUBLISH_SUCCESS";
export const PUBLISH_FAILED = "PUBLISH_FAILED";
export const SUBSCRIBE_SUCCESS = "SUBSCRIBE_SUCCESS";
export const SUBSCRIBE_FAILED = "SUBSCRIBE_FAILED";

type EventHandler = (message: string | null, value: number | null) => void;

interface EventHandlers {
  [event: string]: EventHandler;
}

interface Event {
  event: string;
  message: string;
  value: any;
}

export class NearbyAPI {
  private _nearbyAPI: any;
  private _eventEmitter: DeviceEventEmitterStatic | NativeEventEmitter;
  private _handlers: EventHandlers;
  private _deviceEventSubscription: EmitterSubscription;
  private _isBLEOnly: boolean;

  /**
   * Initializer for the RNNearbyApi wrapper.
   * @param {Boolean} bleOnly Only utilizes bluetooth through the Google Nearby SDK. Defaults to `true`.
   */
  constructor(bleOnly: boolean) {
    this._nearbyAPI = RNNearbyApi;
    this._eventEmitter =
      Platform.OS === "android"
        ? DeviceEventEmitter
        : new NativeEventEmitter(this._nearbyAPI);
    this._handlers = {};
    this._eventEmitter.removeAllListeners('subscribe');
    this._deviceEventSubscription = this._eventEmitter.addListener(
      "subscribe",
      this._eventHandler.bind(this)
    );
    this._isBLEOnly = !!bleOnly;
  }

  connect = (apiKey: string) => {
    this._nearbyAPI.connect(apiKey, this._isBLEOnly);
  };

  disconnect = () => {
    this._nearbyAPI.disconnect();
  };

  isConnected = (cb: (value: boolean) => void) => {
    this._nearbyAPI.isConnected((raw: boolean | number) => {
      cb(!!raw);
    });
  };

  publish = (message: string) => {
    if (message !== null) {
      this._nearbyAPI.publish(message);
    } else {
      throw new Error('Unable to publish a null message.');
    }
  };

  isPublishing = (cb: (value: boolean) => void) => {
    this._nearbyAPI.isPublishing((raw: boolean | number) => {
      cb(!!raw);
    });
  };

  subscribe = () => {
    this._nearbyAPI.subscribe();
  };

  isSubscribing = (cb: (value: boolean) => void) => {
    this._nearbyAPI.isSubscribing((raw: boolean | number) => {
      cb(!!raw);
    });
  };

  unpublish = () => {
    this._nearbyAPI.unpublish();
  };

  unsubscribe = () => {
    this._nearbyAPI.unsubscribe();
  };

  /**
   * Handler Helper Functions.
   */

  onConnected = (handler: EventHandler) => {
    this._setHandler(CONNECTED, handler);
  };

  onConnectionFailure = (handler: EventHandler) => {
    this._setHandler(CONNECTION_FAILED, handler);
  };

  onConnectionSuspended = (handler: EventHandler) => {
    this._setHandler(CONNECTION_SUSPENDED, handler);
  };

  onDisconnected = (handler: EventHandler) => {
    this._setHandler(DISCONNECTED, handler);
  };

  onFound = (handler: EventHandler) => {
    this._setHandler(MESSAGE_FOUND, handler);
  };

  onLost = (handler: EventHandler) => {
    this._setHandler(MESSAGE_LOST, handler);
  };

  onDistanceChanged = (handler: EventHandler) => {
    this._setHandler(DISTANCE_CHANGED, handler);
  };

  onBLESignalChanged = (handler: EventHandler) => {
    this._setHandler(BLE_SIGNAL_CHANGED, handler);
  };

  onPublishSuccess = (handler: EventHandler) => {
    this._setHandler(PUBLISH_SUCCESS, handler);
  };

  onPublishFailed = (handler: EventHandler) => {
    this._setHandler(PUBLISH_FAILED, handler);
  };

  onSubscribeSuccess = (handler: EventHandler) => {
    this._setHandler(SUBSCRIBE_SUCCESS, handler);
  };

  onSubscribeFailed = (handler: EventHandler) => {
    this._setHandler(SUBSCRIBE_FAILED, handler);
  };

  _setHandler = (eventName: string, handler: EventHandler) => {
    this._eventEmitter.removeAllListeners(eventName);
    this._handlers[eventName] = handler;
  };

  _eventHandler = (event: Event) => {
    if (this._handlers.hasOwnProperty(event.event)) {
      this._handlers[event.event](
        event.hasOwnProperty('message') ? event.message : null,
        event.hasOwnProperty('value') ? event.value : null
      );
    }
  };
}
