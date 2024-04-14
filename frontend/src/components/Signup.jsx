import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import * as Yup from "yup";

const SignupSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  mobileNumber: Yup.string().required("Mobile number is required"),
  dob: Yup.date().required("Date of birth is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Signup = () => {
  return (
    <Formik
      initialValues={{
        name: "",
        email: "",
        mobileNumber: "",
        dob: "",
        password: "",
      }}
      validationSchema={SignupSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const response = await axios.post(
            "http://localhost:5000/api/auth/signup",
            values
          );
          alert("Signup successful");
          setSubmitting(false);
        } catch (error) {
          alert("Error during signup");
          console.error(error);
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <h1>Sign Up</h1>
          <label htmlFor="name">Name</label>
          <Field type="text" name="name" />
          <ErrorMessage name="name" component="div" />

          <label htmlFor="email">Email</label>
          <Field type="email" name="email" />
          <ErrorMessage name="email" component="div" />

          <label htmlFor="mobileNumber">Mobile Number</label>
          <Field type="text" name="mobileNumber" />
          <ErrorMessage name="mobileNumber" component="div" />

          <label htmlFor="dob">Date of Birth</label>
          <Field type="date" name="dob" />
          <ErrorMessage name="dob" component="div" />

          <label htmlFor="password">Password</label>
          <Field type="password" name="password" />
          <ErrorMessage name="password" component="div" />

          <button type="submit" disabled={isSubmitting}>
            Sign Up
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default Signup;
