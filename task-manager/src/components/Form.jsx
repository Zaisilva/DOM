import React from 'react';
import { Input, Form, Card } from 'antd';

export const CustomInput = ({ prefix, placeholder, type = "text", ...props }) => {
  const InputComponent = type === "password" ? Input.Password : Input;
  
  return (
    <InputComponent
      prefix={prefix}
      placeholder={placeholder}
      style={{
        background: '#141414',
        borderColor: '#303030',
        color: '#fff'
      }}
      className="custom-input"
      {...props}
    />
  );
};

export const FormCard = ({ children, width = 400, ...props }) => {
  return (
    <Card
      style={{
        width: width,
        background: '#1f1f1f',
        border: '1px solid #303030',
        borderRadius: '8px',
        ...props.style
      }}
      {...props}
    >
      {children}
    </Card>
  );
};

export const AppTitle = ({ title = "Task Manager", ...props }) => {
  return (
    <h2
      style={{
        textAlign: 'center',
        marginBottom: 24,
        color: '#b388ff',
        ...props.style
      }}
      {...props}
    >
      {title}
    </h2>
  );
};

export const GlobalStyles = () => (
  <style>
    {`
      .custom-input {
        color: white !important;
      }
      .custom-input input {
        color: white !important;
      }
      .custom-input input::placeholder {
        color: rgba(255, 255, 255, 0.65) !important;
      }
      .ant-input-password-icon {
        color: #b388ff !important;
      }
    `}
  </style>
);

export const PageBackground = ({ children }) => {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1f3d 100%)'
    }}>
      {children}
    </div>
  );
};