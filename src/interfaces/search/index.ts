import { AnswerInterface } from 'interfaces/answer';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface SearchInterface {
  id?: string;
  query: string;
  date_created?: any;
  user_id: string;
  created_at?: any;
  updated_at?: any;
  answer?: AnswerInterface[];
  user?: UserInterface;
  _count?: {
    answer?: number;
  };
}

export interface SearchGetQueryInterface extends GetQueryInterface {
  id?: string;
  query?: string;
  user_id?: string;
}
