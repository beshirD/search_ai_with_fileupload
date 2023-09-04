import * as yup from 'yup';

export const searchValidationSchema = yup.object().shape({
  query: yup.string().required(),
  date_created: yup.date().required(),
  user_id: yup.string().nullable().required(),
});
