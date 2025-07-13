import clientApi from '../utils/clientApi';
import { Call, CallDetailsType, CreateCallPayload, UpdateCallPayload } from '@moveo/types';

export const getCalls = async (): Promise<Call[]> => {
  return clientApi.get<Call[]>('/calls');
};

export const getCallById = async (id: string): Promise<CallDetailsType> => {
  return clientApi.get<CallDetailsType>(`/calls/${id}`);
};

export const createCall = async (payload: CreateCallPayload): Promise<Call> => {
  return clientApi.post<Call>('/calls', payload);
};

export const updateCall = async (id: string, payload: UpdateCallPayload): Promise<Call> => {
  return clientApi.put<Call>(`/calls/${id}`, payload);
};
