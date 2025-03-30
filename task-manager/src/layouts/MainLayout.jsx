import React, { useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import { 
  HomeOutlined, 
  TeamOutlined, 
  LogoutOutlined, 
  AppstoreAddOutlined, 
  UserOutlined,
  CalendarOutlined 
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const AuthCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const checkAuth = () => {
      if (location.pathname === '/login') {
        return;
      }
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        localStorage.removeItem('userData');
        navigate('/login', { replace: true });
        return;
      }
      
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          navigate('/login', { replace: true });
        }
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        navigate('/login', { replace: true });
      }
    };
    
    checkAuth();
  
  }, [navigate, location.pathname]);
  
  return null; 
};

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState('dash');
  const [userType, setUserType] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
          
          const parsed = JSON.parse(userData);
          setUserType(Number(parsed.userType));
        } else {
          handleLogout();
        }
      } catch (e) {
        console.error('Error parsing user data or token:', e);
        handleLogout();
      }
    } else {
      setIsAuthenticated(false);
      
      if (location.pathname !== '/login') {
        navigate('/login', { replace: true });
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && location.pathname === '/') {
      navigate('/dash', { replace: true });
    }
  }, [location.pathname, navigate, isAuthenticated]);

  useEffect(() => {
    const path = location.pathname.split('/')[1] || 'dash';
    
    const routeToKeyMap = {
      'dash': 'dash',
      'groups': 'groups',
      'team': 'team',
      'users': 'users'
    };
    
    setSelectedKey(routeToKeyMap[path] || path);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUserType(null);
    navigate('/login', { replace: true });
  };

  const getMenuItems = () => {
    const menuItems = [
      {
        key: 'dash',
        icon: <CalendarOutlined />,
        label: 'Dashboard',
        onClick: () => navigate('/dash'),
      },
      {
        key: 'groups',
        icon: <TeamOutlined />,
        label: 'Dashboard Teams',
        onClick: () => navigate('/groups'),
      },
    ];
    
    if (userType === 1) {
      menuItems.push({
        key: 'team',
        icon: <AppstoreAddOutlined />, 
        label: 'Equipos',
        onClick: () => navigate('/team'),
      });
    }
    
    if (userType === 1) {
      menuItems.push({
        key: 'users',
        icon: <UserOutlined />, 
        label: 'Usuarios',
        onClick: () => navigate('/users'),
      })
    }

    return menuItems;
  };

  if (location.pathname === '/login') {
    return children;
  }

  return (
    <Layout style={{ minHeight: '1vh', background: '#1a1a1a' }}>
      <Sider theme="dark" width={182} style={{ background: '#141414' }}>
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
        {isAuthenticated && userType !== null && (
          <Menu
            mode="inline"
            items={[...getMenuItems(), {
              key: 'logout',
              icon: <LogoutOutlined />,
              label: 'Cerrar Sesión',
              onClick: handleLogout,
            }]}
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
            .custom-menu .ant-menu-item-selected .ant-menu-item-icon,
            .custom-menu .ant-menu-item-selected .ant-menu-title-content {
              color: #fff !important;
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