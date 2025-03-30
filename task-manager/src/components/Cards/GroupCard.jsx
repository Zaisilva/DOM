import React from 'react';
import { Typography, Card, Badge, Avatar, Tooltip } from 'antd';
import { TeamOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/es';

const { Text, Paragraph } = Typography;

const GroupCard = ({ group, onClick }) => {
  const isCreator = group.createdBy === localStorage.getItem('userId');
  const primaryColor = '#b388ff'; 
  const secondaryColor = '#9370DB'; 
  const grayColor = '#9e9e9e'; 
  
  return (
    <Card 
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
      onClick={onClick}
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
          <Paragraph ellipsis={{ rows: 2 }} style={{ color: '#000', marginBottom: '16px' }}>
            {group.description}
          </Paragraph>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <UserOutlined style={{ color: '#000', marginRight: '5px' }} />
            <Text type="secondary" style={{ color: '#000' }}>{group.members.length} miembros</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CalendarOutlined style={{ color: '#000', marginRight: '5px' }} />
            <Text type="secondary" style={{ color: '#000' }}>
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

export default GroupCard;