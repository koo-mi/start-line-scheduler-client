import * as yup from "yup";

export const locationValidationSchema: Object = yup.object().shape({
    name: yup.string()
        .required("Must have a name."),
    street_address: yup.string()
        .required("Must have a street address"),
    city: yup.string()
        .required("Must have a city"),
    province: yup.string()
        .required("Must have a state / province"),
    isDefault: yup.boolean(),
});