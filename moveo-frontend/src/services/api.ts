import apiClient from '../utils/api';
import type {
  Tag,
  Task,
  Call,
  CallTask,
  CreateCallRequest,
  UpdateCallRequest,
  CreateTagRequest,
  UpdateTagRequest,
  CreateTaskRequest,
  UpdateTaskRequest,
  LinkTaskToCallRequest,
  LinkTagToCallRequest,
  UpdateCallTaskRequest,
} from '../types';

// Call management
export const callApi = {
  create: async (callData: CreateCallRequest): Promise<Call> => {
    return apiClient.post<Call>('/calls', callData);
  },

  list: async (): Promise<Call[]> => {
    return apiClient.get<Call[]>('/calls');
  },

  get: async (id: number): Promise<Call> => {
    return apiClient.get<Call>(`/calls/${id}`);
  },

  update: async (id: number, callData: UpdateCallRequest): Promise<Call> => {
    return apiClient.patch<Call>(`/calls/${id}`, callData);
  },

  delete: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/calls/${id}`);
  },

  // Call-Task relationship management
  linkTask: async (linkData: LinkTaskToCallRequest): Promise<CallTask> => {
    return apiClient.post<CallTask>('/calls/task', linkData);
  },

  linkTag: async (id: number, linkData: LinkTagToCallRequest): Promise<CallTask> => {
    return apiClient.patch<CallTask>(`/calls/${id}`, linkData);
  },

  getTasks: async (callId: number): Promise<CallTask[]> => {
    return apiClient.get<CallTask[]>(`/calls/task/${callId}`);
  },

  updateTask: async (id: number, taskData: UpdateCallTaskRequest): Promise<CallTask> => {
    return apiClient.patch<CallTask>(`/calls/task/${id}`, taskData);
  },

  createTask: async (data: { name: string; callId: number; status: string }): Promise<CallTask> => {
    return apiClient.post<CallTask>('/calls/task', data);
  },
};

// Task management
export const taskApi = {
  create: async (taskData: CreateTaskRequest): Promise<Task> => {
    return apiClient.post<Task>('/tasks', taskData);
  },

  list: async (): Promise<Task[]> => {
    return apiClient.get<Task[]>('/tasks');
  },

  get: async (id: number): Promise<Task> => {
    return apiClient.get<Task>(`/tasks/${id}`);
  },

  update: async (id: number, taskData: UpdateTaskRequest): Promise<Task> => {
    return apiClient.patch<Task>(`/tasks/${id}`, taskData);
  },

  delete: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/tasks/${id}`);
  },
};

// Tag management
export const tagApi = {
  create: async (tagData: CreateTagRequest): Promise<Tag> => {
    return apiClient.post<Tag>('/tags', tagData);
  },

  list: async (): Promise<Tag[]> => {
    return apiClient.get<Tag[]>('/tags');
  },

  get: async (id: number): Promise<Tag> => {
    return apiClient.get<Tag>(`/tags/${id}`);
  },

  update: async (id: number, tagData: UpdateTagRequest): Promise<Tag> => {
    return apiClient.patch<Tag>(`/tags/${id}`, tagData);
  },

  delete: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/tags/${id}`);
  },
};

export default {
  call: callApi,
  task: taskApi,
  tag: tagApi,
};
