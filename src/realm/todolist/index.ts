import TodoSchema, { TodoSchemaName } from './schema';
import Realm from 'realm';

export interface ITodoItem {
  todoId: number;
  content: string;
  completed: boolean;
  completedAt?: Date | null;
  createdAt: Date;
  updatedAt?: Date | null;
}

const TodoRealm = new Realm({ schema: [TodoSchema] });

const getTodoItems = (): ITodoItem[] => {
  let res;
  try {
    res = TodoRealm.objects(TodoSchemaName);
  } catch (e) {
    console.log('todolist读取失败', e);
    return [];
  }
  return res as unknown as ITodoItem[];
};

const addTodoItem = (item: ITodoItem): boolean => {
  try {
    TodoRealm.write(() => {
      TodoRealm.create(TodoSchemaName, item, true);
    });
  } catch (e) {
    console.log('todolist写入失败', e);
    return false;
  }
  return true;
};

export { addTodoItem, getTodoItems };
