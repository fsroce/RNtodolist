import React from 'react';
import { TodoListApp } from './apps/index';
import { SafeAreaProvider } from 'react-native-safe-area-context';
function App(): React.JSX.Element {
  return (
    <>
      <SafeAreaProvider>
        <TodoListApp />
      </SafeAreaProvider>
    </>
  );
}

export default App;
