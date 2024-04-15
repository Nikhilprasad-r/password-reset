import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const SignInSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

const SignIn = () => {
  const { signIn } = useAuth();

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={SignInSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const response = await axios.post(
            "http://password-reset-mry2.onrender.com/api/auth/signin",
            values
          );
          signIn(response.data.token);
          alert("Sign in successful");
        } catch (error) {
          alert("Failed to sign in");
          console.error(error);
        }
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form className="container">
          <h1 className="text-center">Sign In</h1>
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <Field className="form-control" name="email" type="email" />
          <ErrorMessage className="text-danger" name="email" component="div" />

          <label className="form-label" htmlFor="password">
            Password
          </label>
          <Field className="form-control" name="password" type="password" />
          <ErrorMessage
            className="text-danger"
            name="password"
            component="div"
          />
          <Link to="/reset-password">Forgot password?</Link>
          <div className="mt-4 d-flex justify-content-around">
            <Link className="btn btn-secondary" to="/signup">
              Don't have an account? Sign up
            </Link>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={isSubmitting}
            >
              Sign In
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default SignIn;
