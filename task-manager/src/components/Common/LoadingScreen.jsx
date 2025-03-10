import React from 'react';
import { Spin, Typography } from 'antd';

const { Text } = Typography;

const LoadingScreen = ({ 
  tip = "Cargando...", 
  height = '60vh', 
  subtext = null 
}) => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: height,
      flexDirection: 'column',
      gap: '16px'
    }}>
      <Spin size="large" tip={tip} />
      {subtext && <Text type="secondary">{subtext}</Text>}
    </div>
  );
};

export default LoadingScreen;