import React from 'react'; 
import { Typography, Card, Button, Avatar, Tag, Tooltip, Dropdown, Menu } from 'antd';
import { 
  EllipsisOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  UserOutlined 
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const TeamCard = ({ team, onEdit, onDelete }) => {
  const handleMenuClick = (action) => {
    if (action === 'edit') {
      onEdit(team);
    } else if (action === 'delete') {
      onDelete(team);
    }
  };

  const teamMenu = (
    <Menu>
      <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => handleMenuClick('edit')}>
        Editar equipo
      </Menu.Item>
      <Menu.Item key="delete" icon={<DeleteOutlined />} danger onClick={() => handleMenuClick('delete')}>
        Eliminar equipo
      </Menu.Item>
    </Menu>
  );

  return (
    <Card 
      key={team.id}
      style={{ 
        borderRadius: '16px',
        marginBottom: '20px',
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
        border: '1px solid #f0f0f0',
        overflow: 'hidden'
      }}
      hoverable
    >
      <div 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          height: '6px', 
          background: '#b388ff' 
        }}
      />
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        paddingTop: '10px' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar.Group 
            maxCount={4} 
            maxStyle={{ 
              backgroundColor: '#b388ff',
              color: '#fff' 
            }}
          >
            {team.members.map(member => (
              <Tooltip key={member.id} title={member.name}>
                <Avatar 
                  src={member.avatar} 
                  icon={<UserOutlined />} 
                  style={{ border: '2px solid #f5f0ff' }}
                />
              </Tooltip>
            ))}
          </Avatar.Group>
          <div style={{ marginLeft: '16px' }}>
            <Title level={4} style={{ margin: 0, color: '#333' }}>{team.name}</Title>
            <Text type="secondary">
              {team.members.length} {team.members.length === 1 ? 'miembro' : 'miembros'}
            </Text>
          </div>
        </div>
        <Dropdown overlay={teamMenu} trigger={['click']} placement="bottomRight">
          <Button 
            type="text" 
            icon={<EllipsisOutlined style={{ fontSize: '20px' }} />} 
          />
        </Dropdown>
      </div>
      
      {team.description && (
        <Paragraph 
          style={{ 
            marginTop: '20px', 
            color: '#555',
            backgroundColor: '#fafafa',
            padding: '12px',
            borderRadius: '8px'
          }}
        >
          {team.description}
        </Paragraph>
      )}
      
      <div style={{ 
        marginTop: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        {team.members.map(member => (
          <Tooltip key={member.id} title={member.username ? `@${member.username}` : member.email}>
            <Tag
              color="#f5f0ff"
              style={{ 
                padding: '6px 10px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#7a43b6',
                border: '1px solid #e9d8fd'
              }}
            >
              <Avatar 
                size="small" 
                icon={<UserOutlined />} 
                src={member.avatar}
              />
              {member.name}
            </Tag>
          </Tooltip>
        ))}
      </div>
      
      {team.tags && team.tags.length > 0 && (
        <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {team.tags.map(tag => (
            <Tag 
              key={tag} 
              color="#b388ff" 
              style={{ 
                marginBottom: '0',
                borderRadius: '12px',
                padding: '2px 10px',
                color: '#fff'
              }}
            >
              {tag}
            </Tag>
          ))}
        </div>
      )}
    </Card>
  );
};

export default TeamCard;