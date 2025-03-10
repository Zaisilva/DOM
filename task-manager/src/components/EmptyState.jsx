import React from 'react';
import { Typography, Card } from 'antd';
import { TeamOutlined, FileExclamationOutlined, GroupOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;


const EmptyState = ({ type = 'team', isUserType1, onCreateAction }) => {
  const config = {
    team: {
      icon: <TeamOutlined />,
      title: 'Sin equipos aún',
      description: 'Crea tu primer equipo para empezar a colaborar'
    },
    tasks: {
      icon: <FileExclamationOutlined />,
      title: 'No hay tareas en este grupo',
      description: isUserType1
        ? 'Como creador del grupo, puedes agregar tareas y asignarlas a los miembros.'
        : 'El creador del grupo debe crear tareas y asignarlas a los miembros.'
    },
    dash: {
      icon: <FileExclamationOutlined />,
      title: 'No hay tareas aún',
      description: 'Crea tu primera tarea para empezar '

    },
    groups: {
      icon: <GroupOutlined />,
      title: 'Sin grupos',
      description: 'No perteneces a ningún grupo todavía'
    }
  };

  const currentConfig = config[type];

  const styles = {
    card: {
      textAlign: 'center',
      padding: '60px 40px',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
      background: 'linear-gradient(to bottom, #ffffff, #f9f9ff)',
      border: '1px solid #f0f0ff',
      maxWidth: '600px',
      margin: '40px auto'
    },
    icon: {
      fontSize: '60px',
      color: '#8c6bff',
      marginBottom: '24px',
      background: 'rgba(179, 136, 255, 0.1)',
      padding: '20px',
      borderRadius: '50%',
      display: 'inline-flex',
      boxShadow: '0 4px 12px rgba(179, 136, 255, 0.2)'
    },
    title: {
      color: '#333',
      marginBottom: '16px',
      fontWeight: 600
    },
    description: {
      fontSize: '16px',
      color: '#666',
      maxWidth: '400px',
      margin: '0 auto'
    }
  };

  return (
    <Card style={styles.card} bordered={false}>
      <div style={styles.icon}>
        {currentConfig.icon}
      </div>
      <Title level={3} style={styles.title}>
        {currentConfig.title}
      </Title>
      <Paragraph style={styles.description}>
        {currentConfig.description}
      </Paragraph>
    </Card>
  );
};

export default EmptyState;