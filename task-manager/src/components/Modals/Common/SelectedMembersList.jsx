import React from 'react';
import { Typography, Tag, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Text } = Typography;

export const SelectedMembersList = ({ selectedUsers, handleRemoveUser, currentUser }) => {
  return (
    <div style={{ 
      marginBottom: '20px', 
      background: '#f9f0ff', 
      borderRadius: '8px', 
      padding: '16px',
      border: '1px solid #e9d8fd'
    }}>
      <Text strong style={{ display: 'block', marginBottom: '12px', color: '#7a43b6' }}>
        Miembros seleccionados:
      </Text>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {selectedUsers.length > 0 ? (
          selectedUsers.map(user => (
            <Tag
              key={user.id}
              closable
              onClose={() => handleRemoveUser(user.id)}
              style={{ 
                padding: '5px 10px',
                borderRadius: '16px',
                backgroundColor: user.id === currentUser?.id ? '#e9d8fd' : '#f5f0ff',
                borderColor: '#b388ff',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Avatar 
                size="small" 
                icon={<UserOutlined />} 
                src={user.avatar}
              />
              <div>
                <span style={{ color: '#7a43b6' }}>{user.name}</span>
                {user.id === currentUser?.id && (
                  <span style={{ fontSize: '11px', color: '#9c64d8', marginLeft: '4px' }}>(Tú)</span>
                )}
              </div>
            </Tag>
          ))
        ) : (
          <div style={{ textAlign: 'center', width: '100%', color: '#7a43b6', padding: '16px 0' }}>
            No hay usuarios seleccionados
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectedMembersList;