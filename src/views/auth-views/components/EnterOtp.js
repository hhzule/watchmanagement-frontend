import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button, Form, Input, Divider, Alert, InputNumber } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

// import CustomIcon from 'components/util-components/CustomIcon'
import {
  signUp,
  showAuthMessage,
  showLoading,
  hideAuthMessage,
} from "store/slices/authSlice";

import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export const LoginForm = (props) => {
  const navigate = useNavigate();
  // const location = useLocation();
  let user = localStorage.getItem("Euser");
  const [load, setLoad] = useState(false);

  console.log("user", user);
  const {
    otherSignIn,
    showForgetPassword,
    hideAuthMessage,
    onForgetPasswordClick,
    showLoading,
    extra,
    signUp,
    token,
    loading,
    redirect,
    showMessage,
    message,
    allowRedirect = true,
  } = props;

  const onLogin = (values) => {
    let otp = values.OTP;
    let saved = localStorage.getItem("Euser");
    let val = JSON.parse(saved);
    val.otp = otp.toString();
    console.log("login ran", val);
    showLoading();
    signUp(val);
  };

  const resend = () => {
    let data = JSON.parse(localStorage.getItem("Euser"));
    data.resend = true;
    console.log("verify", data);
    signUp(data);
    setLoad(true);
  };

  useEffect(() => {
    if (token !== null && allowRedirect) {
      navigate(redirect);
    }
    if (showMessage) {
      const timer = setTimeout(() => hideAuthMessage(), 3000);
      return () => {
        clearTimeout(timer);
      };
    }
    if (!user) {
      navigate("/");
    }
  }, []);

  return (
    <>
      {load ? <Alert message="OTP sent" type="success" /> : null}
      <motion.div
        initial={{ opacity: 0, marginBottom: 0 }}
        animate={{
          opacity: showMessage ? 1 : 0,
          marginBottom: showMessage ? 20 : 0,
        }}
      >
        <Alert type="error" showIcon message={message}></Alert>
      </motion.div>
      <Form layout="vertical" name="login-form" onFinish={onLogin}>
        <Form.Item
          name="OTP"
          label="OTP"
          rules={[
            {
              required: true,
              message: "Number must be entered",
              pattern: new RegExp(/^[0-9]+$/),
            },
          ]}
        >
          <InputNumber maxLength={6} controls={false} />
        </Form.Item>
        {loading ? null : (
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Verify
            </Button>
          </Form.Item>
        )}
      </Form>

      <Button type="primary" htmlType="submit" block onClick={resend}>
        Resend
      </Button>
    </>
  );
};

LoginForm.propTypes = {
  otherSignIn: PropTypes.bool,
  showForgetPassword: PropTypes.bool,
  extra: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

LoginForm.defaultProps = {
  otherSignIn: true,
  showForgetPassword: false,
};

const mapStateToProps = ({ auth }) => {
  const { loading, message, showMessage, token, redirect } = auth;
  return { loading, message, showMessage, token, redirect };
};

const mapDispatchToProps = {
  signUp,
  showAuthMessage,
  showLoading,
  hideAuthMessage,
  // signInWithGoogle,
  // signInWithFacebook
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
