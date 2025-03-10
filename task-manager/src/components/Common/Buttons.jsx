import React from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

export const ButtonCircle = ({ onClick }) => (
  <Button
    type="primary"
    shape="circle"
    icon={<PlusOutlined />}
    size="large"
    style={{
      position: 'fixed',
      bottom: '40px',
      right: '40px',
      background: 'linear-gradient(135deg, #b388ff 0%, #7c4dff 100%)',
      borderColor: '#7c4dff',
      width: '60px',
      height: '60px',
      fontSize: '22px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: '0 4px 16px rgba(124, 77, 255, 0.4)',
      transition: 'all 0.3s ease',
      zIndex: 1000, // Asegura que el botón esté siempre encima
    }}
    onClick={onClick}
  />
);




export const ButtonLarge = ({ children, htmlType = "button", onClick, block = true, ...props }) => {
  return (
    <Button
      type="primary"
      htmlType={htmlType}
      block={block}
      onClick={onClick}
      style={{
        background: '#b388ff',
        borderColor: '#b388ff',
        ...props.style
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export const TextLink = ({ children, onClick, ...props }) => {
  return (
    <a
      onClick={onClick}
      style={{
        color: '#b388ff',
        cursor: 'pointer',
        ...props.style
      }}
      {...props}
    >
      {children}
    </a>
  );
};

export const ButtonCancel = ({ onCancel }) => (
  <Button
    style={{
      marginRight: 8,
      borderRadius: '8px',
    }}
    onClick={onCancel}
  >
    Cancelar
  </Button>
);

export const ButtonSubmit = ({ form, submitText }) => (
  <Button
    type="primary"
    htmlType="submit"
    onClick={() => form.submit()}
    style={{
      backgroundColor: '#b388ff',
      borderRadius: '8px',
      border: 'none',
      boxShadow: '0 2px 10px rgba(179, 136, 255, 0.3)',
    }}
  >
    {submitText}
  </Button>
);

export const ActionButton = ({ type, onClick, children, style }) => {
  const baseButtonStyle = {
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    border: 'none',
    marginRight: '8px',
    transition: 'all 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const buttonStyles = {
    edit: {
      ...baseButtonStyle,
      backgroundColor: '#b388ff',
      color: 'white',
      boxShadow: '0 6px 12px rgba(179, 136, 255, 0.3)',
      borderRadius: '12px',
      ':hover': {
        backgroundColor: '#7c4dff',
      },
    },
    delete: {
      ...baseButtonStyle,
      backgroundColor: 'white',
      color: '#ff5252',
      border: '1px solid #ff5252',
      borderRadius: '12px',
      ':hover': {
        backgroundColor: '#ffebee',
      },
    },
  };

  return (
    <button
      style={{ ...buttonStyles[type], ...style }} // Merge custom styles
      onClick={onClick}
    >
      {children}
    </button>
  );
};
