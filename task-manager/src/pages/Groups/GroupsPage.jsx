import React, { useState, useEffect } from 'react';
import { Typography, Card, Row, Col, Button, Badge, Empty, Spin, Avatar, Tooltip, message } from 'antd';
import { TeamOutlined, CalendarOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/es';
import { fetchTeams } from '../../services/teamService';


const { Title, Text, Paragraph } = Typography;

const GroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeams(setGroups, setLoading); // <-- Llamar a fetchTeams
  }, []);


  const handleGroupClick = (groupId) => {
    navigate('/dashboard', { 
      state: { groupId } 
    });
  };

  const renderGroupCard = (group) => {
    const isCreator = group.createdBy === localStorage.getItem('userId');
    const primaryColor = '#b388ff'; // New primary color
    const secondaryColor = '#9370DB'; // Slightly darker for gradients
    const grayColor = '#9e9e9e'; // Elegant gray for icons
    
    return (
      <Card 
        key={group.id}
        hoverable
        style={{ 
          borderRadius: '16px',
          overflow: 'hidden',
          height: '100%',
          boxShadow: '0 6px 16px rgba(179, 136, 255, 0.12)',
          transition: 'all 0.3s ease',
          border: `1px solid ${primaryColor}30`
        }}
        bodyStyle={{ padding: '0' }}
        onClick={() => handleGroupClick(group.id)}
      >
        <div style={{ 
          padding: '18px 22px',
          borderBottom: '1px solid #f0f0f0',
          background: `linear-gradient(135deg, ${primaryColor}15 0%, ${secondaryColor}15 100%)`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar 
                size={50} 
                icon={<TeamOutlined />} 
                style={{ 
                  backgroundColor: primaryColor,
                  boxShadow: `0 2px 10px rgba(179, 136, 255, 0.4)`
                }} 
              />
              <div style={{ marginLeft: '12px' }}>
                <Text strong style={{ fontSize: '18px', fontWeight: 600, color: '#262626' }}>{group.name}</Text>
                <div>
                  <Badge 
                    count={isCreator ? 'Administrador' : 'Miembro'} 
                    style={{ 
                      backgroundColor: primaryColor, 
                      fontSize: '11px',
                      marginTop: '2px'
                    }} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '18px 22px' }}>
          {group.description && (
            <Paragraph ellipsis={{ rows: 2 }} style={{ color: '#595959', marginBottom: '16px' }}>
              {group.description}
            </Paragraph>
          )}
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <UserOutlined style={{ color: grayColor, marginRight: '5px' }} />
              <Text type="secondary">{group.members.length} miembros</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CalendarOutlined style={{ color: grayColor, marginRight: '5px' }} />
              <Text type="secondary">
                {moment(group.createdAt).format('DD MMM, YYYY')}
              </Text>
            </div>
          </div>
          
          {group.members.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <Avatar.Group maxCount={5} maxStyle={{ backgroundColor: primaryColor }}>
                {group.members.map((member, index) => (
                  <Tooltip key={index} title={`Miembro ${index + 1}`}>
                    <Avatar 
                      icon={<UserOutlined />} 
                      style={{ 
                        backgroundColor: '#f0f0f0', 
                        color: grayColor 
                      }}
                    />
                  </Tooltip>
                ))}
              </Avatar.Group>
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div style={{ 
      padding: '24px', 
      maxWidth: '1400px', 
      margin: '0 auto',
      backgroundColor: '#f9f9fb',
      minHeight: '100vh'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <Title level={2} style={{ color: '#262626', fontWeight: 600, margin: '0 0 8px' }}>Mis Grupos</Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>Selecciona un grupo para ver y gestionar sus tareas</Text>
      </div>
      
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <Spin size="large" tip="Cargando grupos..." />
        </div>
      ) : (
        <>
          {groups.length > 0 ? (
            <Row gutter={[24, 28]}>
              {groups.map(group => (
                <Col xs={24} sm={12} lg={8} xl={6} key={group.id}>
                  {renderGroupCard(group)}
                </Col>
              ))}
            </Row>
          ) : (
            <Empty 
              description="No perteneces a ningún grupo todavía" 
              style={{ margin: '60px 0' }}
            />
          )}
        </>
      )}
      
      {localStorage.getItem('userType') === '1' && (
        <Button
          type="primary"
          shape="circle"
          icon={<PlusOutlined />}
          size="large"
          style={{
            position: 'fixed',
            bottom: '40px',
            right: '40px',
            background: `linear-gradient(135deg, #b388ff 0%, #9370DB 100%)`,
            borderColor: '#b388ff',
            width: '60px',
            height: '60px',
            fontSize: '22px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 4px 16px rgba(179, 136, 255, 0.4)',
            transition: 'all 0.3s'
          }}
          onClick={() => navigate('/create-group')}
        />
      )}
    </div>
  );
};

export default GroupsPage;