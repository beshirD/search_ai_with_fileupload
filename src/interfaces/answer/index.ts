import { SearchInterface } from 'interfaces/search';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface AnswerInterface {
  id?: string;
  content: string;
  date_created?: any;
  search_id: string;
  user_id: string;
  created_at?: any;
  updated_at?: any;

  search?: SearchInterface;
  user?: UserInterface;
  _count?: {};
}

export interface AnswerGetQueryInterface extends GetQueryInterface {
  id?: string;
  content?: string;
  search_id?: string;
  user_id?: string;
}
