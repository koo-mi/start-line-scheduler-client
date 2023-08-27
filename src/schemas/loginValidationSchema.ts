import * as yup from "yup";

const emailRe: RegExp = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,6}$/
const passwordRe: RegExp = /^(?=.*[A-Z])(?=.*[0-9])(?!.*\s).{6,}$/

export const loginValidationSchema: Object = yup.object().shape({
    email: yup.string()
        .required("No email provided.")
        .email("Must be valid email format.")
        .matches(emailRe, "Must be valid email format."),
    password: yup.string()
        .required("Required")
        .min(6, "Password is too short - should be 6 char minimum.")
        .matches(passwordRe, "Password must contain uppercase and number."),
});
