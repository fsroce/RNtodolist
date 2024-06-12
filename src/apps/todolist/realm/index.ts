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
    res = TodoRealm.objects(TodoSchemaName) as unknown as ITodoItem[];
  } catch (e) {
    console.log('todolist读取失败', e);
    return [];
  }
  return res;
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

const deleteTodo = (completeId: number) => {
  const todos = getTodoItems();
  const n = todos.length;
  for (let i = 0; i < n; i++) {
    if (todos[i].todoId === completeId) {
      try {
        TodoRealm.write(() => {
          TodoRealm.delete(todos[i]);
        });
        return todos[i];
      } catch (e) {
        console.log('todolist删除失败', e);
      }
    }
  }
};

export { addTodoItem, getTodoItems, deleteTodo };
