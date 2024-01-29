import * as yup from 'yup';

export const profileValidationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  contact: yup.string().required('Contact is required'),
  specialty: yup.string().when('userType', {
    is: 'doctor',
    then: yup.string().required('Specialty is required for doctors'),
    otherwise: yup.string().nullable(),
  }),
  location: yup.string().when('userType', {
    is: 'doctor',
    then: yup.string().required('Location is required for doctors'),
    otherwise: yup.string().nullable(),
  }),
  degreeName: yup.string(),
  institute: yup.string(),
  passingYear: yup.string(),
  clinic: yup.string(),
  startYear: yup.string(),
  endYear: yup.string(),
  description: yup.string(),
});
