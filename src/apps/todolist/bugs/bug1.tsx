import React, { useState, useEffect } from 'react';
import { getTodoItems, ITodoItem, deleteTodoItem, completeTodoItem, undoneTodoItem } from '../realm/index';
import { SwipeListView } from 'react-native-swipe-list-view';
import { StyleSheet } from 'react-native';
import { View, Text } from 'react-native-ui-lib';
import { Button } from '@react-native-material/core';
import TodoItem from '../components/TodoItem';
import { addTodoItem } from '@/apps/todolist/realm';
const styles = StyleSheet.create({
  rowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

type swiperAreaType = {
  text: {
    text: string;
    highLightString: string;
    highLightStyle: { color: string; };
  },
  swiperListView: {
    data: ITodoItem[];
  },
  viewButton: ({ title: string, onPress: (item: ITodoItem) => void })[]
}
const SwiperArea = (p: swiperAreaType): React.JSX.Element => {
  const { text, swiperListView, viewButton } = p;
  return (
    <>
      <Text
        center
        highlightString={text.highLightString}
        highlightStyle={text.highLightStyle}
      >{text.text}</Text>
      <SwipeListView
        style={{ flexGrow: 0 }}
        disableRightSwipe
        data={swiperListView.data.map((_) => ({ key: `${_.todoId}`, data: _ }))}
        renderItem={(data) => <TodoItem {...data.item} />}
        renderHiddenItem={({item}) => (
          <View style={styles.rowBack}>
            {viewButton.map(
              ({ title, onPress }, idx) =>
                <Button variant="text" title={title} color="secondary" onPress={() => onPress(item.data) } key={idx} />
            )}
          </View>
        )}
        rightOpenValue={-120}
      />
    </>
  );
};
const TodoListApp: React.FC = () => {
  const [list, setList] = useState<ITodoItem[]>(getTodoItems());
  const [undoneItem, setUndone] = useState<ITodoItem[]>([]);
  const [completedItem, setCompleted] = useState<ITodoItem[]>([]);
  useEffect(() => {
    /**
     * bug1
     * 这样设计会在删除元素时报错
     * 会将已经删除的元素展示出来
     */
    const u = [], c = [];
    const n = list.length;
    for (let i = 0; i < n; i++) {
      if (list[i].completed) {
        c.push(list[i]);
      } else {
        u.push(list[i]);
      }
    }
    setUndone(u);
    setCompleted(c);
  }, [list]);

  if (!list.length) {
    for (let i = 0; i < 10; i++) {
      addTodoItem({
        todoId: i,
        content: `${i}`,
        completed: false,
        createdAt: new Date(),
      });
    }
  }

  const todoComplete = (item: ITodoItem) => {
    completeTodoItem(item.todoId) && setList(getTodoItems());
  };
  const removeTodo = (item: ITodoItem) => {
    deleteTodoItem(item.todoId) && setList(getTodoItems());
  };
  const undone = (item: ITodoItem) => {
    undoneTodoItem(item.todoId) && setList(getTodoItems());
  };
  return (
    <>
      <SwiperArea
        text={{ text: 'UndoneItems', highLightString: 'Undone', highLightStyle: { color: 'red' } }}
        swiperListView={{ data: undoneItem }}
        viewButton={[
          { title: 'Com', onPress: todoComplete },
          { title: 'Del', onPress: removeTodo },
        ]}
      />
      <SwiperArea
        text={{ text: 'CompletedItems', highLightString: 'Completed', highLightStyle: { color: '#bfa' } }}
        swiperListView={{ data: completedItem }}
        viewButton={[
          { title: 'Und', onPress: undone },
          { title: 'Del', onPress: removeTodo },
        ]}
      />
    </>
  );
};

export default TodoListApp;
