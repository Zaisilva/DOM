import React from 'react';
import { Alert } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

export const InfoAlert = () => {
  return (
    <Alert
      message="Los usuarios que ya forman parte del equipo no aparecerán en los resultados de búsqueda."
      type="info"
      showIcon
      icon={<InfoCircleOutlined />}
      style={{ 
        marginBottom: '16px', 
        borderRadius: '8px',
        border: '1px solid #e9d8fd',
        backgroundColor: '#f5f0ff'
      }}
    />
  );
};

export default InfoAlert;