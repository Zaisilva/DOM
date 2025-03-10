import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col } from 'antd';
import moment from 'moment';
import 'moment/locale/es';
import { fetchPersonalTasks, deleteTask, updateTask } from '../../services/taskService';
import NewTaskModal from '../../components/Modals/NewTaskModal';
import TaskStatusModal from '../../components/Modals/TaskStatusModal';
import EditTaskModal from '../../components/Modals/EditTaskModal';
import { ButtonCircle } from '../../components/Common/Buttons';
import { STATUS_CONFIG } from '../../components/Common/Status';
import LoadingScreen from '../../components/Common/LoadingScreen';
import EmptyState from '../../components/EmptyState';
import TaskStatusColumn from '../../components/TaskStatusColumn';
import PageTitle from '../../components/Common/PageTitle';

const PersonalDashboardPage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTask, setCurrentTask] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(Date.now()); 
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const currentUserId = userData.userId; 
  const userType = userData.userType;
  const isUserType1 = userType === 1;

  moment.locale('es');

  const loadTasks = useCallback(async () => {
    try {
      return new Promise((resolve) => {
        fetchPersonalTasks((updatedTasks) => {
          setTasks(updatedTasks);
          resolve(updatedTasks);
        }, () => {});
      });
    } catch (error) {
      console.error('Error al actualizar tareas personales:', error);
      return tasks; 
    }
  }, [tasks]);

  const getTasksByStatus = useCallback((status) => {
    return tasks.filter(task => task.status === status);
  }, [tasks]);

  const fetchTasksByStatus = useCallback(async (status) => {
    if (Date.now() - lastUpdate < 1000) {
      return getTasksByStatus(status);
    }
    
    const updatedTasks = await loadTasks();
    setLastUpdate(Date.now());
    return updatedTasks.filter(task => task.status === status);
  }, [getTasksByStatus, lastUpdate, loadTasks]);

  useEffect(() => {
    fetchPersonalTasks(setTasks, setLoading);
  }, []);

  const handleMenuClick = (task, action) => {
    if (action === 'changeStatus') {
      setCurrentTask(task);
      setStatusModalVisible(true);
    } else if (action === 'delete') {
      deleteTask(task.id, () => {
        fetchPersonalTasks(setTasks, () => {});
      });
    }
  };

  const handleUpdateTask = (values) => {
    updateTask(currentTask.id, values, true, () => {
      fetchPersonalTasks(setTasks, () => {});
    }, setEditModalVisible);
  };

  const hasTasks = tasks.length > 0;

  return (
    <div style={{ 
      padding: '24px', 
      maxWidth: '1400px', 
      margin: '0 auto',
      backgroundColor: '#f9f9fb',
      minHeight: '100vh'
    }}>
      <PageTitle 
        title="Mis Tareas Personales" 
        subtitle="Organiza y gestiona tus tareas individuales"
      />
      
      {loading ? (
        <LoadingScreen tip="Cargando tareas..." />
      ) : !hasTasks ? (
        <EmptyState type="dash" />
      ) : (
          <Row gutter={[24, 24]} style={{ marginBottom: '40px' }}>
            {Object.keys(STATUS_CONFIG).map(status => (
              <Col xs={24} sm={12} lg={6} key={status}>
                <TaskStatusColumn
                  status={status}
                  config={STATUS_CONFIG[status]}
                  tasks={getTasksByStatus(status)}
                  currentUserId={currentUserId}
                  isUserType1={true}  
                  onMenuClick={handleMenuClick}
                  getMemberName={() => userData.name || userData.displayName || 'Tú'}
                  statusConfig={STATUS_CONFIG}
                  fetchTasks={fetchTasksByStatus} 
                  groupId={null}  // Set to null to indicate these are personal tasks

                />
              </Col>
            ))}
          </Row>
      )}
      
      <ButtonCircle onClick={() => setModalVisible(true)} />
      
      <NewTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onTaskCreated={() => fetchPersonalTasks(setTasks, () => {})}
      />
      
      <EditTaskModal
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onUpdateTask={handleUpdateTask}
        currentTask={currentTask}
        isUserType1={true}  
      />
      
      <TaskStatusModal
        visible={statusModalVisible}
        onCancel={() => setStatusModalVisible(false)}
        onStatusChange={(newStatus) => {
          console.log(`Tarea ${currentTask?.id} actualizada a estado: ${newStatus}`);
        }}
        currentTask={currentTask}
        refreshTasks={() => fetchPersonalTasks(setTasks, () => {})}
      />
    </div>
  );
};

export default PersonalDashboardPage;