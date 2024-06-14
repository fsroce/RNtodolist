import React, { useEffect, useState } from 'react';
import { getTodoItems, ITodoItem } from './realm/index';
import { SwipeListView } from 'react-native-swipe-list-view';
import { StyleSheet, ScrollView } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { View, Text, FloatingButton } from 'react-native-ui-lib';
import { Button } from '@react-native-material/core';
import TodoItem from './components/TodoItem';
import { addTodoItem, deleteTodoItem, updTodoItem } from '@/apps/todolist/realm';
import { arr2obj, obj2arr } from '@/helpers';
import useUserExit from '@/hooks/useUserExit';
import DialogCom from './components/DialogCom';
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
        rightOpenValue={-140}
      />
    </>
  );
};
type ITodoList = Record<string | number, ITodoItem>;
const TodoListApp: React.FC = () => {
  const [list] = useState<ITodoItem[]>(getTodoItems());
  const [c, setC] = useState<ITodoList>({});
  const [u, setU] = useState<ITodoList>({});
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [operationRecord, setOperationRecord] = useState<Record<'add' | 'del' | 'upd', (ITodoItem | number | string)[]>>({
    add: [],
    del: [],
    upd: [],
  });
  const saveChange = () => {
    console.log('开始保存');
    const { add, del, upd } = operationRecord;
    del.forEach((_) => {
      deleteTodoItem(_ as number);
    });
    upd.forEach((_) => {
      updTodoItem(_ as ITodoItem);
    });
    add.forEach((_) => {
      addTodoItem(_ as ITodoItem);
    });
    setOperationRecord({
      add: [], upd: [], del: [],
    });
    console.log('保存完成');
  };
  useUserExit(undefined, saveChange);
  useEffect(() => {
    // 仅在初始化时运行一次
    const _c = list.filter((_) => _.completed);
    setC(arr2obj(_c, 'todoId'));
    const _u = list.filter((_) => !_.completed);
    setU(arr2obj(_u, 'todoId'));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!list.length) {
    for (let i = 0; i < 20; i++) {
      addTodoItem({
        todoId: i,
        content: `${i}`,
        completed: false,
        createdAt: new Date(),
      });
    }
  }
  const setComplete = (item: ITodoItem) => {
    const { todoId } = item;
    if (operationRecord.del.includes(item)) {
      return;
    }
    const _t = { ...item };
    _t.completed = true;
    _t.completedAt = new Date();
    const idx = operationRecord.upd.indexOf(item);
    if (idx !== -1) {
      operationRecord.upd.splice(idx, 1);
    }
    operationRecord.upd.push(_t);
    setU(prevU => {
      const updU = { ...prevU };
      delete updU[todoId];
      return updU;
    });
    setC(prevC => {
      const updC = { ...prevC, [todoId]: _t };
      return updC;
    });
  };
  const removeTodo = (item: ITodoItem) => {
    const { todoId } = item;
    operationRecord.del.push(todoId);
    if (c[todoId]) {
      setC(prevC => {
        const updC = { ...prevC };
        delete updC[todoId];
        return updC;
      });
    }
    if (u[todoId]) {
      setU(prevU => {
        const updU = { ...prevU };
        delete updU[todoId];
        return updU;
      });
    }
  };
  const undone = (item: ITodoItem) => {
    const { todoId } = item;
    if (operationRecord.del.includes(todoId)) {
      return;
    }
    const _t = { ...item };
    _t.completed = false;
    _t.completedAt = undefined;
    const idx = operationRecord.upd.indexOf(item);
    if (idx !== -1) {
      operationRecord.upd.splice(idx, 1);
    }
    operationRecord.upd.push(_t);
    setU(prevU => {
      const updU = { ...prevU, [todoId]: _t };
      return updU;
    });
    setC(prevC => {
      const updC = { ...prevC };
      delete updC[todoId];
      return updC;
    });
  };
  const addTodo = (content :string) => {
    const _t: ITodoItem = {
      todoId: Date.now(),
      content,
      completed: false,
      createdAt: new Date(),
    };
    operationRecord.add.push(_t);
    setU({ ...u, [_t.todoId]: _t });
  };
  return (
    <PaperProvider>
      <DialogCom
        addTodo={addTodo}
        visible={dialogVisible}
        setVisible={setDialogVisible}
      />
      <ScrollView style={{ marginTop: 10 }}>
        <SwiperArea
          text={{ text: 'UndoneItems', highLightString: 'Undone', highLightStyle: { color: 'red' } }}
          swiperListView={{ data: obj2arr(u)}}
          viewButton={[
            { title: 'Com', onPress: setComplete },
            { title: 'Del', onPress: removeTodo },
          ]}
        />
        <SwiperArea
          text={{ text: 'CompletedItems', highLightString: 'Completed', highLightStyle: { color: '#bfa' } }}
          swiperListView={{ data: obj2arr(c) }}
          viewButton={[
            { title: 'Und', onPress: undone },
            { title: 'Del', onPress: removeTodo },
          ]}
        />
      </ScrollView>
      <FloatingButton
        visible
        button={{ label: 'Add', onPress: () => setDialogVisible(true) }}
      />
    </PaperProvider>
  );
};

export default TodoListApp;
