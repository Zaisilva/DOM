import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { message } from 'antd';

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          message.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
          navigate('/login');
        }
      } catch (error) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  }, [navigate, token]);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};
export default PrivateRoute;