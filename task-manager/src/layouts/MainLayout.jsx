import React from 'react';
import { Layout, Menu } from 'antd';
import { HomeOutlined, ProjectOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  
  const menuItems = [
    {
      key: 'dashboard',
      icon: <HomeOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/dashboard')
    },
    {
      key: 'projects',
      icon: <ProjectOutlined />,
      label: 'Proyectos',
      onClick: () => navigate('/dashboard/projects')
    },
    {
      key: 'team',
      icon: <TeamOutlined />,
      label: 'Equipo',
      onClick: () => navigate('/dashboard/team')
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#1a1a1a' }}>
      <Sider 
        theme="dark" 
        width={250}
        style={{ 
          background: '#141414',
          borderRight: '1px solid #303030'
        }}
      >
        <div style={{ 
          height: '64px', 
          padding: '16px', 
          color: '#b388ff', 
          fontSize: '20px', 
          fontWeight: 'bold',
          borderBottom: '1px solid #303030'
        }}>
          Task Manager
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          items={menuItems}
          style={{ 
            background: '#141414',
            color: '#fff'
          }}
          theme="dark"
          selectable={true}
          selectedKeys={['dashboard']}
          className="custom-menu"
        />
        <style>
          {`
            .custom-menu.ant-menu-dark .ant-menu-item-selected {
              background-color: #b388ff !important;
            }
            .custom-menu.ant-menu-dark .ant-menu-item:hover {
              color: #b388ff !important;
            }
          `}
        </style>
      </Sider>
      <Layout>
        <Header style={{ 
          background: '#141414', 
          padding: 0, 
          borderBottom: '1px solid #303030' 
        }} />
        <Content style={{ 
          margin: '24px 16px', 
          padding: 24, 
          background: '#1f1f1f',
          borderRadius: '8px'
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
export default MainLayout;
