import React, { useState, useEffect } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext"; // Import useAuth
import { Navigate } from "react-router-dom"; // For redirection

const UrlManager = () => {
  const { isAuthenticated, user, authToken, apiUrl } = useAuth(); // Extract user and token
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      return; // Early return if not authenticated
    }
    const fetchUrls = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/user-urls`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setUrls(response.data);
      } catch (error) {
        console.error("Failed to fetch URLs", error);
      }
    };
    fetchUrls();
  }, [isAuthenticated, authToken]);

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />; // Redirect if not authenticated
  }

  const initialValues = {
    longUrl: "",
  };

  const validationSchema = Yup.object().shape({
    longUrl: Yup.string().url("Invalid URL format").required("Required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    try {
      const response = await axios.post(
        `${apiUrl}/api/shorten`,
        {
          longUrl: values.longUrl,
          userId: user.id, // Assuming user object has an id
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setUrls((prevUrls) => [...prevUrls, response.data]);
      resetForm();
    } catch (error) {
      alert("Failed to create short URL: " + error.message);
    }
    setSubmitting(false);
  };

  return (
    <div>
      <h1>Your URLs</h1>
      <ul>
        {urls.map((url) => (
          <li key={url._id}>
            {url.longUrl} - {url.shortUrl}
          </li>
        ))}
      </ul>
      <h2>Create a New Short URL</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field type="text" name="longUrl" placeholder="Enter URL" />
            <ErrorMessage name="longUrl" component="div" />

            <button type="submit" disabled={isSubmitting}>
              Create Short URL
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UrlManager;
