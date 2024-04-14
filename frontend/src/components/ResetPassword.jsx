import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import * as Yup from "yup";

const ResetPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const ResetPassword = () => {
  return (
    <Formik
      initialValues={{
        email: "",
      }}
      validationSchema={ResetPasswordSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const response = await axios.post(
            "http://localhost:5000/api/auth/reset-password",
            values
          );
          alert("Check your email for the reset link");
          setSubmitting(false);
        } catch (error) {
          alert("Error sending reset link");
          console.error(error);
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <h1>Reset Password</h1>
          <label htmlFor="email">Email</label>
          <Field type="email" name="email" />
          <ErrorMessage name="email" component="div" />

          <button type="submit" disabled={isSubmitting}>
            Send Reset Link
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default ResetPassword;
