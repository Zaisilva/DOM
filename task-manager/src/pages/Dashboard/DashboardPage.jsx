import React, { useState, useEffect } from 'react';
import { Typography, Card, Row, Col, Button, Badge, Empty, Dropdown, Menu, Modal, Form, Input, DatePicker, Select, message, Spin, Avatar, Tooltip, Tag } from 'antd';
import { 
  ClockCircleOutlined, 
  EllipsisOutlined,
  DeleteOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/es';
import NewTaskModal from '../../components/NewTaskModal';
import TaskStatusModal from '../../components/TaskStatusModal';
import { fetchGroupData } from '../../services/teamService';
import { fetchTasks, deleteTask, updateTask } from '../../services/taskService';
import {ButtonCircle } from '../../components/Buttons';
import { STATUS_CONFIG } from '../../components/Status';
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const DashboardPage = () => {
  const location = useLocation();
  const groupId = location.state?.groupId;
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [groupData, setGroupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTask, setCurrentTask] = useState(null);
  const [form] = Form.useForm();
  const statusFormInstance = Form.useForm()[0];
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const currentUserId = userData.userId; 
  const userType = userData.userType;
  const currentUsername = userData.username;
  const statusForm = Form.useForm()[0];

  const isUserType1 = userType === 1;

  moment.locale('es');

  useEffect(() => {
    if (groupId) {
      fetchGroupData(groupId, setGroupData, setGroupMembers, setLoading);
      fetchTasks(groupId, setTasks, setLoading);
    } else {
      navigate('/groups');
    }
  }, [groupId]);
  
  

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const canEditTask = (task) => {
    if (isUserType1) return true;
    
    return task.assignedUserId === currentUserId || task.assignedTo === currentUserId;
  };

  const canEditTaskStatus = (task) => {
    return task.assignedUserId === currentUserId || task.assignedTo === currentUserId;
  };

  const handleMenuClick = (task, action) => {
    if (action === 'changeStatus') {
      setCurrentTask(task);
      setStatusModalVisible(true);
    } else if (action === 'delete') {

      const handleDeleteTask = (taskId) => {
        deleteTask(taskId, () => fetchTasks(groupId, setTasks, setLoading));
      };
    }
  };
  const handleUpdateTask = (values) => {
    updateTask(currentTask.id, values, isUserType1, () => fetchTasks(groupId, setTasks, setLoading), setEditModalVisible);
  };

  const getMemberName = (userId) => {
    const member = groupMembers.find(m => m.id === userId);
    return member ? member.name : 'Usuario';
  };
  const renderTaskCard = (task) => {
    const config = STATUS_CONFIG[task.status];
    
    const isAssignedToCurrentUser = task.assignedUserId === currentUserId || task.assignedTo === currentUserId;
    
    const assignedUserName = task.assignedUsername || 
      (task.assignedUserId ? getMemberName(task.assignedUserId) : getMemberName(task.assignedTo));
    
    const taskMenu = (
      <Menu>
        {canEditTaskStatus(task) && (
          <Menu.Item key="changeStatus" icon={<ClockCircleOutlined />} onClick={() => handleMenuClick(task, 'changeStatus')}>
            Cambiar estado
          </Menu.Item>
        )}
        
        {isUserType1 && (
          <Menu.Item key="delete" icon={<DeleteOutlined />} danger onClick={() => handleMenuClick(task, 'delete')}>
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
              
              {/* Etiqueta que muestra si la tarea está asignada al usuario actual */}
              {isAssignedToCurrentUser && (
                <Tag color={config.color} style={{ marginLeft: '8px', borderRadius: '12px' }}>
                  Mi tarea
                </Tag>
              )}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* Mostrar el menú solo si el usuario puede editar el estado */}
              {(canEditTask(task) || canEditTaskStatus(task)) && (
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
              {/* Mostrar el usuario asignado */}
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
                <Text type="secondary" style={{ fontSize: '12px', color: '#8c8c8c' }}>
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

  // Verificar si hay tareas en total
  const hasTasks = tasks.length > 0;

  const renderEmptyState = () => (
    <div style={{ 
      textAlign: 'center', 
      padding: '60px 20px',
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
      margin: '40px auto',
      maxWidth: '600px'
    }}>
      <Empty 
        description={
          <div>
            <Title level={4} style={{ marginBottom: '16px', color: '#262626' }}>
              No hay tareas en este grupo
            </Title>
            <Text style={{ display: 'block', color: '#8c8c8c', marginBottom: '24px' }}>
              {isUserType1 
                ? 'Como creador del grupo, puedes agregar tareas y asignarlas a los miembros.'
                : 'El creador del grupo debe crear tareas y asignarlas a los miembros.'}
            </Text>
      
          </div>
        }
      />
    </div>
  );
  

  return (
    <div style={{ 
      padding: '24px', 
      maxWidth: '1400px', 
      margin: '0 auto',
      backgroundColor: '#f9f9fb',
      minHeight: '100vh'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <Title level={2} style={{ color: '#262626', fontWeight: 600, margin: 0 }}>Tareas del Grupo</Title>
      </div>
      
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <Spin size="large" tip="Cargando tareas..." />
        </div>
      ) : !hasTasks ? (
        renderEmptyState()
      ) : (
        <Row gutter={[24, 24]} style={{ marginBottom: '40px' }}>
          {Object.keys(STATUS_CONFIG).map(status => {
            const statusTasks = getTasksByStatus(status);
            const config = STATUS_CONFIG[status];

            return (
              <Col xs={24} sm={12} lg={6} key={status}>
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
                      count={statusTasks.length} 
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
                    {statusTasks.length > 0 ? (
                      statusTasks.map(renderTaskCard)
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
              </Col>
            );
          })}
        </Row>
      )}
      
      {isUserType1 && (
          <ButtonCircle onClick={() => setModalVisible(true)} />
      )}
      
      <NewTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onTaskCreated={fetchTasks}
        groupId={groupId}
        groupMembers={groupMembers}
      />
      
      <Modal
        title="Editar Tarea"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateTask}
        >
          <Form.Item
            name="nameTask"
            label="Nombre de la tarea"
            rules={[{ required: true, message: 'Por favor ingresa un nombre para la tarea' }]}
          >
            <Input disabled={!isUserType1} />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Descripción"
          >
            <TextArea rows={4} disabled={!isUserType1} />
          </Form.Item>
          
          <Form.Item
            name="status"
            label="Estado"
            rules={[{ required: true, message: 'Por favor selecciona un estado' }]}
          >
            <Select>
              {Object.keys(STATUS_CONFIG).map(status => (
                <Option key={status} value={status}>
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: STATUS_CONFIG[status].color, marginRight: '8px' }}>
                      {STATUS_CONFIG[status].icon}
                    </span>
                    {STATUS_CONFIG[status].label}
                  </span>
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          {isUserType1 && (
            <>
              <Form.Item
                name="deadline"
                label="Fecha límite"
              >
                <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
              </Form.Item>
              
              <Form.Item
                name="category"
                label="Categoría"
              >
                <Select allowClear>
                  <Option value="Urgente">Urgente</Option>
                  <Option value="Importante">Importante</Option>
                  <Option value="Recordatorio">Recordatorio</Option>
                  <Option value="Seguimiento">Seguimiento</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                name="assignedTo"
                label="Asignado a"
                rules={[{ required: true, message: 'Por favor selecciona un miembro' }]}
              >
                <Select>
                  {groupMembers.map(member => (
                    <Option key={member.id} value={member.id}>{member.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}
          
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: '8px' }}>
              Guardar
            </Button>
            <Button onClick={() => setEditModalVisible(false)}>
              Cancelar
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <TaskStatusModal
      visible={statusModalVisible}
      onCancel={() => setStatusModalVisible(false)}
      onStatusChange={(newStatus) => {
        console.log(`Tarea ${currentTask?.id} actualizada a estado: ${newStatus}`);
      }}
      currentTask={currentTask}
      refreshTasks={fetchTasks}
    />
    </div>
  );
};

export default DashboardPage;