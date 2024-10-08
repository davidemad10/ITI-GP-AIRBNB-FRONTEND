// src/components/modals/LoginModal.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { useSelector, useDispatch } from "react-redux";
import {
  closeLoginModal,
  openPasswordResetModal,
} from "../../redux/modalSlice";
import CustomButton from "../forms/CustomButton";
import { login } from "../../redux/authSlice"; // Import login thunk
import PasswordResetModal from "./PasswordResetModal";
import PasswordInput from "../forms/PasswordInput";
import { toast } from "react-toastify"; // Import toast
import PropTypes from "prop-types";
import { openSignupModal } from "../../redux/modalSlice";

const LoginModal = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modal.loginModalOpen);
  const authState = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const close = () => {
    dispatch(closeLoginModal());
  };

  const submitLogin = async (e) => {
    e.preventDefault();

    // Dispatch the login thunk
    dispatch(login({ email, password }))
      .unwrap()
      .then((user) => {
        localStorage.setItem("userId", user.user_id);
        localStorage.setItem("username", user.user.username);
        close();
        toast.success("Login successful!", {
          onClose: () => navigate("/"),
        });
      })
      .catch((error) => {
        console.error("Login error:", error);
        if (error.non_field_errors) {
          toast.error(error.non_field_errors.join(", "));
        } else {
          const fieldErrors = Object.entries(error)
            .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
            .join(" | ");
          toast.error(fieldErrors || "Login failed. Please try again.");
        }
      });
  };

  const openResetModal = () => {
    dispatch(openPasswordResetModal());
  };

  const content = (
    <form onSubmit={submitLogin}>
      <div className="mb-3">
        <label htmlFor="loginEmail" className="form-label">
          Email address
        </label>
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

      <PasswordInput
        id="loginPassword"
        label="Password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {/* Optionally, display errors here */}
      {authState.error && (
        <div className="alert alert-danger" role="alert">
          {Array.isArray(authState.error.non_field_errors)
            ? authState.error.non_field_errors.join(", ")
            : "Login failed. Please check your credentials and try again."}
        </div>
      )}

      <CustomButton label="Submit" type="submit" />

      <div className="mt-3">
        <button type="button" className="btn btn-link" onClick={openResetModal}>
          Forgot Password?
        </button>
        <p className="mt-3 ml-3">
          don't have an Account ?{" "}
          <button
            className="btn btn-link"
            onClick={() => {
              dispatch(closeLoginModal());
              dispatch(openSignupModal());
            }}
          >
            sign up
          </button>
        </p>
      </div>
    </form>
  );

  return (
    <>
      <Modal isOpen={isOpen} close={close} label="Log in" content={content} />
      <PasswordResetModal />
    </>
  );
};

LoginModal.propTypes = {
  // Define propTypes if any props are passed to LoginModal
};

export default LoginModal;
