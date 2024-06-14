import React, { useEffect, useState } from 'react';
import { Button, Dialog, Portal, TextInput } from 'react-native-paper';

interface DialogComProps {
  addTodo: (content: string) => void;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}
const DialogCom: React.FC<DialogComProps> = (p) => {
  const { addTodo, visible, setVisible } = p;
  const [textInput, setTextInput] = useState<string>('');
  useEffect(() => {
    console.log('visible', visible);
  }, [visible]);
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={() => {setVisible(false); setTextInput('');}}>
        <Dialog.Title>Add new Item</Dialog.Title>
        <Dialog.Content>
          <TextInput mode="outlined" label="Todo Description" value={textInput} onChangeText={text => setTextInput(text)} />
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={() => {
              setVisible(false);
              if (textInput !== '') {
                addTodo(textInput);
              }
              setTextInput('');
            }}
          >
            Done
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default DialogCom;
