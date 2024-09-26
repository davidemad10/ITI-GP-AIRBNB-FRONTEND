import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Modal from "./Modal";
import useLoginModal from "../../hooks/useLoginModal";
import CustomButton from "../forms/CustomButton";
import { handleLogin } from "../../lib/actions";
import apiService from "../../services/apiService";

const LoginModal = () => {
  const navigate = useNavigate();
  const loginModal = useLoginModal();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  const submitLogin = async (e) => {
    e.preventDefault();

    const formData = {
      email: email,
      password: password
    };

    const response = await apiService.postWithoutToken('/api/auth/login/', formData);

    if (response.access) {
      handleLogin(response.user.pk, response.access, response.refresh);
      loginModal.close();
      navigate('/');
    } else {
      setErrors(response.non_field_errors || ['Login failed. Please try again.']);
    }
  };

  const content = (
    <form onSubmit={submitLogin}>
      <div className="mb-3">
        <label htmlFor="loginEmail" className="form-label">Email address</label>
        <input
          type="email"
          className="form-control"
          id="loginEmail"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="loginPassword" className="form-label">Password</label>
        <input
          type="password"
          className="form-control"
          id="loginPassword"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {errors.length > 0 && (
        <div className="alert alert-danger" role="alert">
          {errors.map((error, index) => (
            <div key={`error_${index}`}>{error}</div>
          ))}
        </div>
      )}

      <CustomButton label="Submit" type="submit" />
    </form>
  );

  return (
    <Modal
      isOpen={loginModal.isOpen}
      close={loginModal.close}
      label="Log in"
      content={content}
    />
  );
};

export default LoginModal;
