import * as yup from "yup";

const emailRe: RegExp = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,6}$/
const passwordRe: RegExp = /^(?=.*[A-Z])(?=.*[0-9])(?!.*\s).{6,}$/

export const signUpValidationSchema: Object = yup.object().shape({

    name: yup.string()
        .required("No name provided."),

    email: yup.string()
        .required("No email provided.")
        .email("Must be valid email format.")
        .matches(emailRe, "Must be valid email format."),

    password: yup.string()
        .required("Password is required")
        .min(6, "Password is too short - should be 6 char minimum.")
        .matches(passwordRe, "Password must contain uppercase and number."),

    confirm_password: yup.string()
        .required("Confirm Password is required.")
        .oneOf([yup.ref('password')], "Password must match."),

    default_mode: yup.string()
        .required("Mode of transportation is required.")
        .oneOf(["driving", "transit", "walking", "bicycling"]),

});
