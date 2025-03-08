import React from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

export const ButtonCircle = ({ onClick }) => (
  <Button
    type="primary"
    shape="circle"
    icon={<PlusOutlined />}
    size="large"
    style={{
      position: 'fixed',
      bottom: '40px',
      right: '40px',
      background: 'linear-gradient(135deg, #b388ff 0%, #7c4dff 100%)',
      borderColor: '#7c4dff',
      width: '60px',
      height: '60px',
      fontSize: '22px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: '0 4px 16px rgba(124, 77, 255, 0.4)',
      transition: 'all 0.3s',
    }}
    onClick={onClick}
  />
);

export default { ButtonCircle };
