import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogHeader, Stack, TextInput } from '@react-native-material/core';

interface DialogComProps {
  addTodo: (content: string) => void;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}
const DialogCom: React.FC<DialogComProps> = (p) => {
  const { addTodo, visible, setVisible } = p;
  const [textInput, setTextInput] = useState<string>('');
  return (
    <Dialog visible={visible} onDismiss={() => setVisible(false)}>
      <DialogHeader title="add todo item" />
      <DialogContent>
        <Stack spacing={2}>
          <TextInput value={textInput} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          title="comfirm"
          variant="text"
          compact
          onPress={() => {
            addTodo(textInput);
            setTextInput('');
            setVisible(false);
          }}
        />
        <Button
          title="cancel"
          variant="text"
          compact
          onPress={() => {
            setTextInput('');
            setVisible(false);
          }}
        />
      </DialogActions>
    </Dialog>
  );
};

export default DialogCom;
