import React, { useState, useEffect } from 'react';
import { Empty, Typography, Badge } from 'antd';
import TaskCard from './Cards/TaskCard';

const { Title, Text } = Typography;

const TaskStatusColumn = ({ 
  status, 
  config, 
  tasks: initialTasks, 
  currentUserId, 
  isUserType1, 
  onMenuClick, 
  getMemberName,
  statusConfig,
  fetchTasks,
  groupId  
}) => {
  const [tasks, setTasks] = useState([]);
  
  const filterTasks = (tasksToFilter) => {
    if (!tasksToFilter || !Array.isArray(tasksToFilter)) {
      return [];
    }
    
    const statusFiltered = tasksToFilter.filter(task => 
      task.status.toLowerCase() === status.toLowerCase()
    );
    
    let result = [];
    if (groupId) {
      result = statusFiltered.filter(task => {
        const isGroupTask = task.groupId === groupId && task.isPersonal !== true;
        return isGroupTask;
      });
    } else {
      result = statusFiltered.filter(task => {
        const isPersonalTask = task.isPersonal === true;
        return isPersonalTask;
      });
    }
    
    return result;
  };

  useEffect(() => {
    const filteredTasks = filterTasks(initialTasks);
    setTasks(filteredTasks);
  }, [initialTasks, groupId, status]);
  
  useEffect(() => {
    if (typeof fetchTasks !== 'function') return;
    
    const intervalId = setInterval(async () => {
      try {
        const updatedTasks = await fetchTasks(status);
        const filteredTasks = filterTasks(updatedTasks);
        
        setTasks(prevTasks => {
          if (JSON.stringify(prevTasks) !== JSON.stringify(filteredTasks)) {
            return filteredTasks;
          }
          return prevTasks;
        });
      } catch (error) {
        console.error('Error al actualizar tareas:', error);
      }
    }, 5000); 
    
    return () => clearInterval(intervalId);
  }, [status, fetchTasks, groupId]);

  return (
    <div 
      style={{ 
        background: '#fff',
        borderRadius: '16px',
        padding: '20px',
        height: '100%',
        minHeight: '500px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '20px',
        padding: '12px 16px',
        background: `${config.color}10`,
        borderRadius: '10px',
        boxShadow: `0 2px 8px ${config.color}20`
      }}>
        <span style={{ marginRight: '10px', color: config.color, fontSize: '18px' }}>
          {config.icon}
        </span>
        <Title level={4} style={{ color: '#262626', margin: 0, fontWeight: 600 }}>
          {config.label}
        </Title>
        <Badge 
          count={tasks.length} 
          style={{ 
            backgroundColor: config.color, 
            marginLeft: '10px',
            boxShadow: `0 2px 6px ${config.color}40` 
          }} 
        />
      </div>
      
      <div style={{ 
        overflowY: 'auto', 
        flexGrow: 1,
        padding: '4px 2px'
      }}>
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              statusConfig={statusConfig}  
              currentUserId={currentUserId}
              isUserType1={isUserType1}
              onMenuClick={onMenuClick}
              getMemberName={getMemberName}
            />
          ))
        ) : (
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
            description={
              <Text style={{ color: '#8c8c8c', fontStyle: 'italic' }}>
                No hay tareas en esta sección
              </Text>
            }
            style={{ margin: '60px 0' }}
          />
        )}
      </div>
    </div>
  );
};

export default TaskStatusColumn;