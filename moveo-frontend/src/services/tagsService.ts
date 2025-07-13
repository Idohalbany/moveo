import clientApi from '../utils/clientApi';
import { CreateTagPayload, Tag, UpdateTagPayload } from '@moveo/types';

export const getAllTags = async (): Promise<Tag[]> => {
  return clientApi.get<Tag[]>('/tags');
};

export const createTag = async (payload: CreateTagPayload): Promise<Tag> => {
  return clientApi.post<Tag>('/tags', payload);
};

export const updateTag = async (id: string, payload: UpdateTagPayload): Promise<Tag> => {
  return clientApi.put<Tag>(`/tags/${id}`, payload);
};

export const deleteTag = async (id: string): Promise<void> => {
  return clientApi.delete<void>(`/tags/${id}`);
};
