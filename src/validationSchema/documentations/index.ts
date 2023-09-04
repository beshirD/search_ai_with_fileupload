import * as yup from 'yup';

export const documentationValidationSchema = yup.object().shape({
  title: yup.string().required(),
  content: yup.string().required(),
  date_created: yup.date().required(),
  date_updated: yup.date().nullable(),
  organization_id: yup.string().nullable().required(),
  user_id: yup.string().nullable().required(),
});
