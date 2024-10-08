// src/components/modals/SignupModal.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import { useSelector, useDispatch } from 'react-redux';
import { closeSignupModal, openLoginModal } from '../../redux/modalSlice';
import CustomButton from '../forms/CustomButton';
import axiosInstance from '../../axios';
import PasswordInput from '../forms/PasswordInput'; // Import the new component

const SignupModal = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modal.signupModalOpen);
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [errors, setErrors] = useState([]);
  const [username, setUsername] = useState('');

  const close = () => {
    dispatch(closeSignupModal());
  };

  const submitSignup = async (e) => {
    e.preventDefault();

    const errors = [];
    if (!username) errors.push("Username is required.");
    if (username.length > 20) errors.push("Username cannot exceed 20 characters.");
    if (!email) errors.push("Email is required.");
    if (!password1) errors.push("Password is required.");
    if (!password2) errors.push("Confirm Password is required.");
    if (password1 !== password2) errors.push("Passwords do not match.");
  
    if (errors.length > 0) {
      setErrors(errors);
      return;
    }
  
    const formData = {
      username,
      email,
      password1,
      password2,
    };
  
    try {
      const response = await axiosInstance.post('/api/auth/register/', formData);
      if (response.status === 204) {
        // Assuming the registration is successful
        close();
        // Optionally, display a success message (consider using local state to manage it)
        console.log("User registered successfully.");
        navigate('/');
      }    
    } catch (error) {
      if (error.response && error.response.data) {
        console.error("Error response data:", error.response.data);
        const tmpErrors = Object.entries(error.response.data).flatMap(([key, value]) => 
          Array.isArray(value) ? value.map(v => `${key}: ${v}`) : [`${key}: ${value}`]
        );
        setErrors(tmpErrors);
      } else {
        console.error("Request failed:", error);
        setErrors(["An unexpected error occurred. Please try again."]);
      }
    }
  };

  const content = (
    <form onSubmit={submitSignup}>
      <div className="mb-3">
        <label htmlFor="signupUsername" className="form-label">Username</label>
        <input
          type="text"
          className="form-control"
          id="signupUsername"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          maxLength={20}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="signupEmail" className="form-label">Email address</label>
        <input
          type="email"
          className="form-control"
          id="signupEmail"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <PasswordInput
        id="signupPassword1"
        label="Password"
        placeholder="Password"
        value={password1}
        onChange={(e) => setPassword1(e.target.value)}
        required
      />

      <PasswordInput
        id="signupPassword2"
        label="Confirm Password"
        placeholder="Confirm Password"
        value={password2}
        onChange={(e) => setPassword2(e.target.value)}
        required
      />

      {errors.length > 0 && (
        <div className="alert alert-danger" role="alert">
          {errors.map((error, index) => (
            <div key={`error_${index}`}>{error}</div>
          ))}
        </div>
      )}

<p>
          Already have an Account ?{" "}
          <button
            className="btn btn-link"
            onClick={() => {
              dispatch(closeSignupModal());
              dispatch(openLoginModal());
            }}
          >
            Login
          </button>
        </p>

      <CustomButton label="Submit" type="submit" />
    </form>
  );

  return <Modal isOpen={isOpen} close={close} label="Sign up" content={content} />;
};

export default SignupModal;
