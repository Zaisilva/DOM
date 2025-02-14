import React from 'react';
import { Typography, Card, Row, Col, Statistic } from 'antd';
import { ProjectOutlined, TeamOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

const DashboardPage = () => {
  return (
    <div>
      <Title level={2} style={{ color: '#fff' }}>Dashboard</Title>
      <Row gutter={16}>
        <Col span={8}>
          <Card style={{ 
            background: '#141414', 
            border: '1px solid #303030',
            borderRadius: '8px'
          }}>
            <Statistic
              title={<span style={{ color: '#b388ff' }}>Proyectos Activos</span>}
              value={5}
              valueStyle={{ color: '#fff' }}
              prefix={<ProjectOutlined style={{ color: '#b388ff' }} />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ 
            background: '#141414', 
            border: '1px solid #303030',
            borderRadius: '8px'
          }}>
            <Statistic
              title={<span style={{ color: '#b388ff' }}>Miembros del Equipo</span>}
              value={12}
              valueStyle={{ color: '#fff' }}
              prefix={<TeamOutlined style={{ color: '#b388ff' }} />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ 
            background: '#141414', 
            border: '1px solid #303030',
            borderRadius: '8px'
          }}>
            <Statistic
              title={<span style={{ color: '#b388ff' }}>Tareas Completadas</span>}
              value={25}
              valueStyle={{ color: '#fff' }}
              prefix={<CheckCircleOutlined style={{ color: '#b388ff' }} />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;