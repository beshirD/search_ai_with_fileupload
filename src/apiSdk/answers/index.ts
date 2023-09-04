import axios from 'axios';
import queryString from 'query-string';
import { AnswerInterface, AnswerGetQueryInterface } from 'interfaces/answer';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getAnswers = async (query?: AnswerGetQueryInterface): Promise<PaginatedInterface<AnswerInterface>> => {
  const response = await axios.get('/api/answers', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createAnswer = async (answer: AnswerInterface) => {
  const response = await axios.post('/api/answers', answer);
  return response.data;
};

export const updateAnswerById = async (id: string, answer: AnswerInterface) => {
  const response = await axios.put(`/api/answers/${id}`, answer);
  return response.data;
};

export const getAnswerById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/answers/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteAnswerById = async (id: string) => {
  const response = await axios.delete(`/api/answers/${id}`);
  return response.data;
};
