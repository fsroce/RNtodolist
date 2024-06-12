import React, { useState } from 'react';
import { getTodoItems, ITodoItem, deleteTodo } from './realm/index';
import { SwipeListView } from 'react-native-swipe-list-view';
import { View, StyleSheet } from 'react-native';
import { Button } from '@react-native-material/core';
import TodoItem from './components/TodoItem';
import { addTodoItem } from '@/apps/todolist/realm';
export const styles = StyleSheet.create({
  rowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
const TodoListApp: React.FC = () => {
  const [list, setList] = useState<ITodoItem[]>(getTodoItems());
  if (!list.length) {
    for (let i = 0; i < 10; i++) {
      addTodoItem({
        todoId: Date.now(),
        content: `${i}`,
        completed: false,
        createdAt: new Date(),
      });
    }
  }
  const completeTodo = () => {
    console.log('completeTodo');
  };
  const removeTodo = (item: ITodoItem) => {
    deleteTodo(item.todoId) && setList(getTodoItems());
  };
  return (
    <SwipeListView
      disableRightSwipe
      data={list.map((_) => ({ key: `${_.todoId}`, data: _ }))}
      renderItem={(data) => <TodoItem {...data.item} />}
      renderHiddenItem={({item}) => (
        <View style={styles.rowBack}>
          <Button variant="text" title="Com" color="secondary" onPress={completeTodo} />
          <Button variant="text" title="Del" color="secondary" onPress={() => removeTodo(item.data)} />
        </View>
      )}
      rightOpenValue={-120}
    />
  );
};

export default TodoListApp;
