import { DocumentationInterface } from 'interfaces/documentation';
import { InvitationInterface } from 'interfaces/invitation';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface OrganizationInterface {
  id?: string;
  description?: string;
  date_created?: any;
  date_updated?: any;
  name: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  tenant_id: string;
  documentation?: DocumentationInterface[];
  invitation?: InvitationInterface[];
  user?: UserInterface;
  _count?: {
    documentation?: number;
    invitation?: number;
  };
}

export interface OrganizationGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  name?: string;
  user_id?: string;
  tenant_id?: string;
}
