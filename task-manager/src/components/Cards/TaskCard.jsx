import React from 'react';
import { Typography, Card, Button, Badge, Dropdown, Menu, Avatar, Tooltip, Tag } from 'antd';
import { 
  ClockCircleOutlined, 
  EllipsisOutlined,
  DeleteOutlined,
  UserOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Text, Paragraph } = Typography;

const TaskCard = ({ 
  task, 
  statusConfig, 
  currentUserId,
  isUserType1,
  onMenuClick,
  getMemberName
}) => {
  const config = statusConfig[task.status];
  const isAssignedToCurrentUser = task.assignedUserId === currentUserId || task.assignedTo === currentUserId;
  const assignedUserName = task.assignedUsername || 
    (task.assignedUserId ? getMemberName(task.assignedUserId) : getMemberName(task.assignedTo));
  
  const canEditTask = () => {
    if (isUserType1) return true;
    return task.assignedUserId === currentUserId || task.assignedTo === currentUserId;
  };

  const canEditTaskStatus = () => {
    return task.assignedUserId === currentUserId || task.assignedTo === currentUserId;
  };
  
  const taskMenu = (
    <Menu>
      {canEditTaskStatus() && (
        <Menu.Item key="changeStatus" icon={<ClockCircleOutlined />} onClick={() => onMenuClick(task, 'changeStatus')}>
          Cambiar estado
        </Menu.Item>
      )}
      
      {isUserType1 && (
       <Menu.Item 
       key="delete" 
       icon={<DeleteOutlined />} 
       danger 
       onClick={() => {
         console.log('Delete button clicked for task:', task.id);
         if (typeof onMenuClick === 'function') {
           onMenuClick(task, 'delete');
         } else {
           console.error('onMenuClick is not a function', onMenuClick);
         }
       }}
     >
       Eliminar tarea
     </Menu.Item>
      )}
    </Menu>
  );
  
  return (
    <Card 
      key={task.id}
      style={{ 
        background: '#fff', 
        border: `1px solid ${config.color}30`,
        borderRadius: '12px',
        marginBottom: '16px',
        boxShadow: isAssignedToCurrentUser ? `0 4px 12px ${config.color}40` : '0 4px 12px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease'
      }}
      hoverable
      bodyStyle={{ padding: '16px' }}
    >
      <div style={{ borderLeft: `3px solid ${config.color}`, paddingLeft: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <Text strong style={{ color: '#262626', fontSize: '16px', fontWeight: 600 }}>{task.nameTask}</Text>
            
            {isAssignedToCurrentUser && (
              <Tag color={config.color} style={{ marginLeft: '8px', borderRadius: '12px' }}>
                Mi tarea
              </Tag>
            )}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {(canEditTask() || canEditTaskStatus()) && (
              <Dropdown overlay={taskMenu} trigger={['click']} placement="bottomRight">
                <Button type="text" icon={<EllipsisOutlined style={{ fontSize: '18px' }} />} />
              </Dropdown>
            )}
          </div>
        </div>
        
        {task.description && (
          <Paragraph ellipsis={{ rows: 2 }} style={{ fontSize: '14px', color: '#595959', marginBottom: '8px' }}>
            {task.description}
          </Paragraph>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title={`Asignado a: ${assignedUserName}`}>
              <div style={{ display: 'flex', alignItems: 'center', marginRight: '12px' }}>
                <Avatar 
                  size="small" 
                  icon={<UserOutlined />} 
                  style={{ 
                    backgroundColor: isAssignedToCurrentUser ? config.color : '#8c8c8c',
                    marginRight: '4px'
                  }} 
                />
              </div>
            </Tooltip>
            
            {task.deadline && (
              <Text type="secondary" style={{ fontSize: '12px', color: '#464646' }}>
                Fecha límite: {moment(task.deadline).format('DD MMM, YYYY')}
              </Text>
            )}
          </div>
          
          {task.category && (
            <Badge 
              count={task.category} 
              style={{ 
                backgroundColor: 'white', 
                color: config.color, 
                borderColor: config.color,
                fontWeight: 500,
                fontSize: '12px'
              }} 
            />
          )}
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;