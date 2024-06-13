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

const completeTodoItem = (completedId : number) => {
  try {
    TodoRealm.write(() => {
      const todo = TodoRealm.objectForPrimaryKey(TodoSchemaName, completedId);
      if (todo) {
        todo.completed = true;
        todo.completedAt = new Date();
      } else {
        throw new Error('todoId不存在');
      }
    });
  } catch (e) {
    console.log('todo更新失败', e);
    return false;
  }
  return true;
};

const undoneTodoItem = (undoneId: number) => {
  try {
    TodoRealm.write(() => {
      const todo = TodoRealm.objectForPrimaryKey(TodoSchemaName, undoneId);
      if (todo) {
        todo.completed = false;
        todo.completedAt = null;
      } else {
        throw new Error('todoId不存在');
      }
    });
  } catch (e) {
    console.log('undone失败', e);
    return false;
  }
  return true;
};

const deleteTodoItem = (deleteId: number) => {
  try {
    TodoRealm.write(() => {
      const todo = TodoRealm.objectForPrimaryKey(TodoSchemaName, deleteId);
      if (todo) {
        TodoRealm.delete(todo);
      } else {
        throw new Error('todoId不存在');
      }
    });
  } catch (e) {
    console.log('删除todo失败', e);
    return false;
  }
  return true;
};

export { addTodoItem, getTodoItems, deleteTodoItem, completeTodoItem, undoneTodoItem };
