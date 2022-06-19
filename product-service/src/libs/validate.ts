import * as yup from 'yup';

export const yupObject = yup.object().shape({
  title: yup.string().required().min(1),
  description: yup.string().required().min(1),
  price: yup.number().required().min(0.01),
  count: yup.number().required().min(1),
  image: yup.string().url(),
});
