import React from 'react';
import { Typography } from 'antd';

const { Title, Text } = Typography;

const PageTitle = ({ title, subtitle }) => {
  return (
    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
      <Title level={2} style={{ color: '#000', fontWeight: 600, margin: '0 0 8px' }}>{title}</Title>
      {subtitle && <Text type="secondary" style={{ fontSize: '16px', color: '#000' }}>{subtitle}</Text>}
    </div>
  );
};

export default PageTitle;