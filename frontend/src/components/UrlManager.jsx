import React, { useState, useEffect } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
const UrlManager = () => {
  const { isAuthenticated, user, authToken, apiUrl } = useAuth();
  const [urls, setUrls] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin", { replace: true });
    }
  }, [isAuthenticated, navigate]);
  useEffect(() => {
    if (isAuthenticated && user) {
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
    }
  }, [isAuthenticated, user, authToken, apiUrl]);

  const deleteUrl = async (urlId) => {
    try {
      await axios.delete(`${apiUrl}/api/urls/${urlId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setUrls(urls.filter((url) => url._id !== urlId));
    } catch (error) {
      console.error("Failed to delete the URL", error);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  const initialValues = {
    longUrl: "",
  };

  const validationSchema = Yup.object().shape({
    longUrl: Yup.string().url("Invalid URL format").required("Required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (!user || !user.id) {
      alert("User is not authenticated or user ID is not available.");
      setSubmitting(false);
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(
        `${apiUrl}/api/shorten`,
        {
          longUrl: values.longUrl,
          userId: user.id,
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
    <div className="container">
      <h1 className="row d-flex justify-content-center">Your URLs</h1>
      <table class="table">
        <thead class="thead-dark">
          <tr>
            <th scope="col">Used times</th>
            <th scope="col">Long Url</th>
            <th scope="col">ShortUrl</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((url) => (
            <tr key={url._id}>
              <td>{url.clicks}</td>
              <td> {url.longUrl}</td>
              <td>
                {apiUrl}/{url.shortUrl}
              </td>
              <td>
                <button onClick={() => deleteUrl(url._id)}>delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ul></ul>
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
