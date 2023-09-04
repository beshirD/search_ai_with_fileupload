import axios from 'axios';
import queryString from 'query-string';
import { DocumentationInterface, DocumentationGetQueryInterface } from 'interfaces/documentation';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getDocumentations = async (
  query?: DocumentationGetQueryInterface,
): Promise<PaginatedInterface<DocumentationInterface>> => {
  const response = await axios.get('/api/documentations', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createDocumentation = async (documentation: DocumentationInterface) => {
  const response = await axios.post('/api/documentations', documentation);
  return response.data;
};

export const updateDocumentationById = async (id: string, documentation: DocumentationInterface) => {
  const response = await axios.put(`/api/documentations/${id}`, documentation);
  return response.data;
};

export const getDocumentationById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/documentations/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteDocumentationById = async (id: string) => {
  const response = await axios.delete(`/api/documentations/${id}`);
  return response.data;
};
