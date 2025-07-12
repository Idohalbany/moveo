export interface Tag {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Task {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Call {
  id: number;
  title: string;
  createdAt?: string;
  updatedAt?: string;
  tags?: Tag[];
  tasks?: CallTask[];
}

export interface CallTask {
  name: string;
  id: number;
  callId: number;
  taskId: number;
  status: TaskStatus;
  task?: Task;
  createdAt?: string;
  updatedAt?: string;
}

export type TaskStatus = 'Open' | 'In Progress' | 'Completed';

export interface CreateCallRequest {
  title: string;
}

export interface UpdateCallRequest {
  title?: string;
}

export interface CreateTagRequest {
  name: string;
}

export interface UpdateTagRequest {
  name?: string;
}

export interface CreateTaskRequest {
  name: string;
}

export interface UpdateTaskRequest {
  name?: string;
}

export interface LinkTaskToCallRequest {
  callId: number;
  taskId: number;
}

export interface LinkTagToCallRequest {
  tagIds: Array<number>;
}


export interface UpdateCallTaskRequest {
  status: TaskStatus;
}