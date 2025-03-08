import { message } from 'antd';
import api from './api';

export const onRegister = async (values, navigate) => {
  try {
    await api.post('/auth/register', values);
    message.success('¡Usuario registrado exitosamente!');
    
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  } catch (error) {
    if (error.response?.data?.error) {
      message.error(error.response.data.error);
    } else if (error.response?.status === 400) {
      message.error('El usuario ya existe');
    } else {
      message.error('Error en el registro. Por favor, intenta de nuevo');
    }
  }
};

export const onLogin = async (values, navigate) => {
  try {
    const response = await api.post('/auth/login', {
      email: values.username,
      password: values.password
    });

    localStorage.setItem('token', response.data.token);
    localStorage.setItem('userData', JSON.stringify({
      username: response.data.user.username,
      userType: response.data.user.tipo,
      userId: response.data.user.id,
    }));

    message.success(`¡Bienvenido ${response.data.user.username}!`);
    navigate('/groups');
  } catch (error) {
    if (error.response?.data?.error) {
      message.error(error.response.data.error);
    } else if (error.response?.status === 401) {
      message.error('Email o contraseña incorrectos');
    } else {
      message.error('Error al iniciar sesión. Por favor, intenta de nuevo');
    }
  }
};
