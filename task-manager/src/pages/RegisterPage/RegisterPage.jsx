import React from 'react';
import { Form } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { onRegister } from '../../services/authService';
import { ButtonLarge, TextLink } from '../../components/Common/Buttons';
import { 
  CustomInput, 
  FormCard, 
  AppTitle, 
  GlobalStyles, 
  PageBackground 
} from '../../components/Form';

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleRegister = async (values) => {
    onRegister(values, navigate);
  };

  return (
    <PageBackground>
      <FormCard>
        <AppTitle />
        <Form
          name="register"
          onFinish={handleRegister}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Por favor ingresa tu email' },
              { type: 'email', message: 'Ingresa un email válido' }
            ]}
          >
            <CustomInput
              prefix={<MailOutlined style={{ color: '#b388ff' }} />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Por favor ingresa tu usuario' }]}
          >
            <CustomInput
              prefix={<UserOutlined style={{ color: '#b388ff' }} />}
              placeholder="Usuario"
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
              Registrarse
            </ButtonLarge>
          </Form.Item>
          <div style={{ textAlign: 'center' }}>
            <TextLink onClick={() => navigate('/login')}>
              ¿Ya tienes cuenta? Inicia sesión
            </TextLink>
          </div>
        </Form>
        <GlobalStyles />
      </FormCard>
    </PageBackground>
  );
};

export default RegisterPage;