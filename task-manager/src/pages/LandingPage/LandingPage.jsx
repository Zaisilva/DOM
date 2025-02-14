import React from 'react';
import { Button, Typography, Space } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div style={{ 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1f3d 100%)'
    }}>
      <Space direction="vertical" align="center" size="large">
        <Title style={{ color: '#fff' }}>Bienvenido a Task Manager</Title>
        <Paragraph style={{ color: '#b388ff', fontSize: '18px' }}>
          Gestiona tus proyectos de manera eficiente
        </Paragraph>
        <Space>
          <Button 
            type="primary" 
            size="large" 
            onClick={() => navigate('/login')}
            style={{ 
              background: '#b388ff',borderColor: '#b388ff'}}>
            Iniciar Sesión
          </Button>
        </Space>
      </Space>
    </div>
  );
};

export default LandingPage;