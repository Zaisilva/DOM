import React from 'react';
import { Form } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { onLogin } from '../../services/authService';
import { ButtonLarge, TextLink } from '../../components/Common/Buttons';
import { 
  CustomInput, 
  FormCard, 
  AppTitle, 
  GlobalStyles, 
  PageBackground 
} from '../../components/Form';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = (values) => {
    onLogin(values, navigate);
  };

  return (
    <PageBackground>
      <FormCard>
        <AppTitle />
        <Form
          name="login"
          onFinish={handleLogin}
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Por favor ingresa tu email' }]}
          >
            <CustomInput
              prefix={<UserOutlined style={{ color: '#b388ff' }} />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Por favor ingresa tu contraseña' }]}
          >
            <CustomInput
              type="password"
              prefix={<LockOutlined style={{ color: '#b388ff' }} />}
              placeholder="Contraseña"
            />
          </Form.Item>
          <Form.Item>
            <ButtonLarge htmlType="submit">
              Iniciar Sesión
            </ButtonLarge>
          </Form.Item>
          <div style={{ textAlign: 'center' }}>
            <TextLink onClick={() => navigate('/register')}>
              ¿No tienes cuenta? Regístrate
            </TextLink>
          </div>
        </Form>
        <GlobalStyles />
      </FormCard>
    </PageBackground>
  );
};

export default LoginPage;