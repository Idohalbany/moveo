//* Enums *// 

export enum TaskStatus {
  Open,
  InProgress,
  Completed
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.Open]: 'Open',
  [TaskStatus.InProgress]: 'In Progress',
  [TaskStatus.Completed]: 'Completed',
};

export enum ManagementArea {
  Admin = 'admin',
  User = 'user',
}

//* Types *//

export type Tag = {
  id: string;
  name: string;
};

export type Task = {
  id: string;
  callId: string;
  name: string;
  status: TaskStatus;
};

export type Call = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
};

export type CallDetailsType = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  tasks: {
    id: string;
    name: string;
    status: number;
  }[];
}

export type SuggestedTask = {
  id: string;
  name: string;
  tags: string[];
};

//* Interfaces *//

export interface CreateCallPayload {
  name: string;
  tags?: string[];
  tasks?: string[];
}

export interface UpdateCallPayload {
  name?: string;
  tags?: string[];
}

export interface CreateTagPayload {
  name: string;
}

export interface UpdateTagPayload {
  name: string;
}

export interface CreateTaskPayload {
  callId: string;
  name: string;
  status: TaskStatus;
}

export interface UpdateTaskPayload {
  name?: string;
  status?: TaskStatus;
}