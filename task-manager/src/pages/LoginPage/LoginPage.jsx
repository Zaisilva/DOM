import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const USERS = [
  { username: 'zai', password: '123456' }
];

const LoginPage = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    const user = USERS.find(
      u => u.username === values.username && u.password === values.password
    );
    if (user) {
      message.success('¡Bienvenido!');
      navigate('/dashboard');
    } else {
      message.error('Credenciales inválidas');
    }
  };
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1f3d 100%)'
    }}>
      <Card 
        style={{ 
          width: 400,
          background: '#1f1f1f',
          border: '1px solid #303030',
          borderRadius: '8px'
        }}
      >
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: 24,
          color: '#b388ff'
        }}>Task Manager</h2>
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Por favor ingresa tu usuario' }]}
          >
            <Input 
              prefix={<UserOutlined style={{ color: '#b388ff' }} />} 
              placeholder="Usuario"
              style={{ 
                background: '#141414',
                borderColor: '#303030',
                color: '#fff'
              }}
              className="custom-input"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Por favor ingresa tu contraseña' }]}
          >
            <Input.Password 
              prefix={<LockOutlined style={{ color: '#b388ff' }} />} 
              placeholder="Contraseña"
              style={{ 
                background: '#141414',
                borderColor: '#303030',
                color: '#fff'
              }}
              className="custom-input"
            />
          </Form.Item>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block
              style={{ 
                background: '#b388ff',
                borderColor: '#b388ff'
              }}
            >
              Iniciar Sesión
            </Button>
          </Form.Item>
        </Form>
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
      </Card>
    </div>
  );
};
export default LoginPage;
