import React, { useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import { HomeOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState('dashboard');
  const [userType, setUserType] = useState(null);

  // Efecto para obtener el tipo de usuario del localStorage y asegurarse de que sea un número
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUserType(Number(parsed.userType)); // Convertimos a número
      } catch (e) {
        console.error('Error al parsear datos de usuario:', e);
        setUserType(null);
      }
    }
  }, []);

  // Efecto para actualizar la selección del menú según la ruta actual
  useEffect(() => {
    const path = location.pathname.split('/')[1] || 'groups';
    setSelectedKey(path);
  }, [location]);

  // Crear los elementos del menú según el tipo de usuario
  const getMenuItems = () => {
    const menuItems = [
      {
        key: 'groups',
        icon: <HomeOutlined />,
        label: 'Dashboard',
        onClick: () => navigate('/groups'),
      },
    ];

    if (userType === 1) {
      menuItems.push({
        key: 'team',
        icon: <TeamOutlined />,
        label: 'Teams',

        onClick: () => navigate('/team'),
      });
    }

    return menuItems;
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#1a1a1a' }}>
      <Sider theme="dark" width={250} style={{ background: '#141414' }}>
        <div
          style={{
            height: '64px',
            padding: '16px',
            color: '#b388ff',
            fontSize: '20px',
            fontWeight: 'bold',
            borderBottom: '1px solid #303030',
          }}
        >
          Task Manager
        </div>
        {userType !== null && ( // Solo renderizar el menú si userType ya está definido
          <Menu
            mode="inline"
            items={getMenuItems()}
            style={{ background: '#141414', color: '#fff' }}
            theme="dark"
            selectable={true}
            selectedKeys={[selectedKey]}
            className="custom-menu"
          />
        )}
        <style>
          {`
            .custom-menu .ant-menu-item-selected {
              background-color: #b388ff !important;
            }
            .custom-menu .ant-menu-item:hover {
              color: #b388ff !important;
            }
          `}
        </style>
      </Sider>
      <Layout>
        <Header style={{ background: '#141414', padding: 0, borderBottom: '1px solid #303030' }} />
        <Content>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
