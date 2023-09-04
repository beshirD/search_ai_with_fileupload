import * as yup from 'yup';

export const organizationValidationSchema = yup.object().shape({
  description: yup.string().nullable(),
  date_created: yup.date().nullable(),
  date_updated: yup.date().nullable(),
  name: yup.string().required(),
  user_id: yup.string().nullable().required(),
});
