import React, { useState } from 'react';
import { TodoRealm } from '@/realm/index';
import { SwipeListView } from 'react-native-swipe-list-view';
import { View, StyleSheet } from 'react-native';
import { Button } from '@react-native-material/core';
import TodoItem from './components/TodoItem';
import { addTodoItem } from '@/realm/todolist';
export const styles = StyleSheet.create({
  todoItem: {
    marginTop: 10,
    width: '100%',
    backgroundColor: '#bfa',
  },
  rowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  fontSize: {
    fontSize: 30,
  },
  height: {
    height: 80,
  },
});
const TodoListApp: React.FC = () => {
  const { getTodoItems } = TodoRealm;
  const [list] = useState<TodoRealm.ITodoItem[]>(getTodoItems());
  if (!list.length) {
    for (let i = 0; i < 10; i++) {
      addTodoItem({
        todoId: Date.now(),
        content: 'test',
        completed: false,
        createdAt: new Date(),
      });
    }
  }
  return (
    <SwipeListView
      disableRightSwipe
      data={list.map((_, idx) => ({ key: `${idx}`, data: _ }))}
      renderItem={(data) => <TodoItem {...data.item} />}
      renderHiddenItem={() => (
        <View style={styles.rowBack}>
          <Button variant="text" title="Com" color="secondary" />
          <Button variant="text" title="Del" color="secondary" />
        </View>
      )}
      rightOpenValue={-100}
    />
  );
};

export default TodoListApp;
