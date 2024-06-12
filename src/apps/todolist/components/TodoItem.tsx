import React from 'react';
import { ITodoItem } from '../realm/index';
import { ListItem } from '@react-native-material/core';

interface ITodoItemProps {
  key: string
  data: ITodoItem
  index?: string
  separators?: any
}

const TodoItem: React.FC<ITodoItemProps> = (p) => {
  const { data } = p;
  return (
    <ListItem
      title={data.content}
      secondaryText={`creted at ${data.createdAt.toLocaleDateString()}`}
    />
  );
};

export default TodoItem;
