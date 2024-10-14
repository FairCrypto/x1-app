'use client';

import type { Dispatch } from 'react';
import { createContext, useReducer } from 'react';

type TNotificationState = {
  isLoading: boolean; // background data refresh is happening
  isProcessing: boolean; // wallet interaction is happening
  alerts: any[];
  messages: any[];
};

const init = (initialState: TNotificationState) => ({
  ...initialState
});

export const reducer = (state: any, action) => {
  switch (action.type) {
    case 'setLoading':
      return {
        ...state,
        isLoading: action.payload
      };
    case 'setProcessing':
      return {
        ...state,
        isProcessing: action.payload
      };
    case 'addAlert':
      return {
        ...state,
        alerts: state.alerts.find((a: any) => a.key === action.payload.key)
          ? state.alerts
          : [...state.alerts, action.payload]
      };
    case 'removeAlert':
      return {
        ...state,
        alerts: state.alerts.filter((a: any) => a.key !== action.payload)
      };
    case 'clearAlerts':
      return { ...state, alerts: [] };
    case 'pushMessage':
      return {
        ...state,
        messages: state.messages.find((a: any) => a.key === action.payload.key)
          ? state.messages
          : [...state.messages, action.payload]
      };
    case 'popMessage':
      return {
        ...state,
        messages: state.messages.filter((a: any) => a.key !== action.payload)
      };
    default:
      return state;
  }
};

const initialState: TNotificationState = {
  isLoading: false, // background data refresh is happening
  isProcessing: false, // wallet interaction is happening
  alerts: [],
  messages: []
};

type Context = {
  notifications: TNotificationState;
  dispatchNotification: Dispatch<any>;
  message: Record<string, (...any) => void>;
  setProcessing: (...any) => void;
  setLoading: (...any) => void;
};

export const NotificationsContext = createContext<Context>({
  notifications: initialState,
  dispatchNotification: _ => {},
  message: {},
  setProcessing: _ => {},
  setLoading: _ => {}
});

export const NotificationsProvider = ({ children }) => {
  const [notifications, dispatchNotification] = useReducer(reducer, initialState, init);

  const message = {
    info: content =>
      dispatchNotification({
        type: 'pushMessage',
        payload: { severity: 'success', text: content, key: content }
      }),
    warning: content =>
      dispatchNotification({
        type: 'pushMessage',
        payload: { severity: 'warning', text: content, key: content }
      }),
    alert: content =>
      dispatchNotification({
        type: 'addAlert',
        payload: { severity: 'warning', text: content, key: content }
      }),
    bannerWithAction: (content, key, action, cta) =>
      dispatchNotification({
        type: 'addAlert',
        payload: { severity: 'info', text: content, key, action, cta }
      }),
    removeAlert: key =>
      dispatchNotification({
        type: 'removeAlert',
        payload: key
      })
  };

  const setLoading = (status: boolean) =>
    dispatchNotification({
      type: 'setLoading',
      payload: status
    });

  const setProcessing = (status: boolean) =>
    dispatchNotification({
      type: 'setProcessing',
      payload: status
    });

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        dispatchNotification,
        message,
        setProcessing,
        setLoading
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
