import React from 'react';
import { TodoRealm } from '@/realm/index';
import { Text, View } from 'react-native';
import { styles } from '../index';
interface ITodoItemProps {
  key: string
  data: TodoRealm.ITodoItem
  index?: string
  separators?: any
}

const TodoItem: React.FC<ITodoItemProps> = (p) => {
  const { data } = p;
  return (
    // <SwipeRow
    //   disableLeftSwipe={true}
    // >
    //   {/* <View><Text>{ data.todoId }</Text></View> */}
    //   <></>
    //   <View><Text>{ data.content }</Text></View>
    // </SwipeRow>
    <View style={[styles.todoItem, styles.height]}>
      <Text style={styles.fontSize}>{ data.content }</Text>
    </View>
  );
};

export default TodoItem;
