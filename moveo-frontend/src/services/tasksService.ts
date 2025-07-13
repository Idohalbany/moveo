import clientApi from '../utils/clientApi';
import { CreateTaskPayload, Task, UpdateTaskPayload } from '@moveo/types';


export const getAllTasks = async (): Promise<Task[]> => {
  return clientApi.get<Task[]>('/tasks');
};

export const createTask = async (payload: CreateTaskPayload): Promise<Task> => {
  const { callId, ...taskData } = payload;

  const contentData = {
    ...taskData,
  };

  return clientApi.post<Task>(`/tasks/calls/${callId}/tasks`, contentData);
};

export const updateTask = async (id: string, payload: UpdateTaskPayload): Promise<Task> => {
  return clientApi.put<Task>(`/tasks/${id}`, payload);
};

export const deleteTask = async (id: string): Promise<void> => {
  return clientApi.delete<void>(`/tasks/${id}`);
};
