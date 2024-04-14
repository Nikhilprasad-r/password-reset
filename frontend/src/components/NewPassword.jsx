import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const NewPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5000/api/auth/reset/${token}`,
        { password }
      );
      alert("Password reset successfully");
    } catch (error) {
      alert("Failed to reset password");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Enter New Password</h1>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Reset Password</button>
    </form>
  );
};

export default NewPassword;
