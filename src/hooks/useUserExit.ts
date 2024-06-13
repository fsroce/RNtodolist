import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
type voidFunc = (...args: any) => void;
const useUserExit = (onEnter?: voidFunc, onExit?: voidFunc) => {
  const [appState, setAppState] = useState(AppState.currentState);
  useEffect(() => {
    const handleQuit = (nextAppState: any) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        onEnter && onEnter();
        console.log('App has come to the foreground!');
      } else if (appState.match(/active/) && nextAppState === 'background') {
        onExit && onExit();
        console.log('App has come to the background!');
      }
      setAppState(nextAppState);
    };
    const subscription = AppState.addEventListener('change', handleQuit);
    return () => {
      subscription.remove();
    };
  }, [appState, onExit, onEnter]);
};

export default useUserExit;
