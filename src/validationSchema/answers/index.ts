import * as yup from 'yup';

export const answerValidationSchema = yup.object().shape({
  content: yup.string().required(),
  date_created: yup.date().required(),
  search_id: yup.string().nullable().required(),
  user_id: yup.string().nullable().required(),
});
