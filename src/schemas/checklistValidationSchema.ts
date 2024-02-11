import * as yup from 'yup';

export const checklistValidationSchema: Object = yup.object().shape({
	title: yup.string().required('Must have a title.'),
	description: yup.string(),
	isDaily: yup.boolean(),
	priority: yup
		.string()
		.required('Must select priority.')
		.oneOf(['low', 'medium', 'high'], 'Must be low, medium or high.')
});
