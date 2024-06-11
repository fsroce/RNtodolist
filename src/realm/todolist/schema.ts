import { ObjectSchema } from 'realm';

export const TodoSchemaName = 'todolist';

const TodoSchema: ObjectSchema = {
  name: TodoSchemaName,
  primaryKey: 'todoId',
  properties: {
    todoId: 'int',
    content: 'string',
    completed: 'bool',
    completedAt: 'date?',
    createdAt: 'date',
    updatedAt: 'date?',
  },
};

export default TodoSchema;
