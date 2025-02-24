import React, { useState, useEffect } from 'react';
import { Typography, Card, Row, Col, Button, Badge, Empty, Dropdown, Menu, Modal, Form, Input, DatePicker, Select, message, Spin, Avatar, Tooltip, Divider } from 'antd';
import { 
  PlusOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  PauseCircleOutlined, 
  ExclamationCircleOutlined,
  EditOutlined,
  EllipsisOutlined,
  DeleteOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/es';
import NewTaskModal from '../../components/NewTaskModal';
import api from '../../services/api';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// Configuración de estados (mantener igual)
const STATUS_CONFIG = {
  'In Progress': {
    label: 'En Progreso',
    color: '#1890ff',
    icon: <ClockCircleOutlined />,
    badgeStatus: 'processing'
  },
  'Done': {
    label: 'Completado',
    color: '#52c41a',
    icon: <CheckCircleOutlined />,
    badgeStatus: 'success'
  },
  'Paused': {
    label: 'Pausado',
    color: '#faad14',
    icon: <PauseCircleOutlined />,
    badgeStatus: 'warning'
  },
  'Revision': {
    label: 'En Revisión',
    color: '#ff4d4f',
    icon: <ExclamationCircleOutlined />,
    badgeStatus: 'error'
  }
};

const DashboardPage = () => {
  // Usar useLocation para obtener el estado pasado por navigate
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

  const currentUserId = localStorage.getItem('userId');
  
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userType = userData.userType;
  
  const isUserType1 = userType === 1;

  const isGroupCreator = groupData?.createdBy === currentUserId;
  
  moment.locale('es');

  const fetchGroupData = async () => {
    try {
      const response = await api.get(`/teams/${groupId}`);
      setGroupData(response.data);
      
      // Obtener detalles de los miembros del grupo
      const membersResponse = await api.get(`/teams/${groupId}/members`);
      setGroupMembers(membersResponse.data);
    } catch (error) {
      message.error('Error al cargar la información del grupo');
      console.error('Error fetching group data:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get(`tasks/list/${groupId}`);
      setTasks(response.data);
      console.log(response.data);

    } catch (error) {
      message.error('Error al cargar las tareas');
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (groupId) {
      fetchGroupData();
      fetchTasks();
    } else {
      navigate('/groups');
    }
  }, [groupId]);

  const getTasksByStatus = (status) => {
    // Ordenar tareas para mostrar primero las asignadas al usuario actual
    const statusTasks = tasks.filter(task => task.status === status);
    
    // Separar las tareas entre las asignadas al usuario actual y las demás
    const userTasks = statusTasks.filter(task => task.assignedTo === currentUserId);
    const otherTasks = statusTasks.filter(task => task.assignedTo !== currentUserId);
    
    // Devolver primero las tareas del usuario y luego las demás
    return [...userTasks, ...otherTasks];
  };

  // Actualizado: SOLO el usuario asignado puede cambiar el estado
  const canChangeTaskStatus = (task) => {
    return task.assignedTo === currentUserId;
  };

  // El creador del grupo puede eliminar cualquier tarea
  const canDeleteTask = (task) => {
    return isGroupCreator;
  };

  const handleMenuClick = (task, action) => {
    if (action === 'delete') {
      if (!canDeleteTask(task)) {
        message.warning('Solo el creador del grupo puede eliminar tareas');
        return;
      }
      
      Modal.confirm({
        title: '¿Estás seguro que deseas eliminar esta tarea?',
        content: 'Esta acción no se puede deshacer',
        okText: 'Eliminar',
        okType: 'danger',
        cancelText: 'Cancelar',
        onOk: async () => {
          try {
            await api.delete(`/tasks/${task.id}`);
            message.success('Tarea eliminada correctamente');
            fetchTasks();
          } catch (error) {
            message.error('Error al eliminar la tarea');
          }
        }
      });
    } else if (action === 'changeStatus') {
      if (!canChangeTaskStatus(task)) {
        message.warning('Solo el usuario asignado puede cambiar el estado de esta tarea');
        return;
      }
      
      setCurrentTask(task);
      form.setFieldsValue({
        status: task.status
      });
      
      // Abrir modal de cambio de estado
      Modal.confirm({
        title: 'Cambiar Estado',
        content: (
          <Form form={form}>
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
          </Form>
        ),
        onOk: async () => {
          try {
            const values = form.getFieldsValue();
            await api.put(`/tasks/${task.id}/status`, { status: values.status });
            message.success('Estado actualizado correctamente');
            fetchTasks();
          } catch (error) {
            message.error('Error al actualizar el estado');
          }
        }
      });
    }
  };

  const getMemberName = (userId) => {
    const member = groupMembers.find(m => m.id === userId);
    return member ? member.name : 'Usuario';
  };

  const renderTaskCard = (task) => {
    const config = STATUS_CONFIG[task.status];
    
    const isAssignedToCurrentUser = task.assignedTo === currentUserId;
    
    const taskMenu = (
      <Menu>
        {canChangeTaskStatus(task) && (
          <Menu.Item key="changeStatus" icon={<ClockCircleOutlined />} onClick={() => handleMenuClick(task, 'changeStatus')}>
            Cambiar estado
          </Menu.Item>
        )}
        
        {canDeleteTask(task) && (
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
          boxShadow: isAssignedToCurrentUser ? `0 4px 12px ${config.color}30` : '0 4px 12px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease'
        }}
        hoverable
        bodyStyle={{ padding: '16px' }}
      >
        <div style={{ borderLeft: `3px solid ${config.color}`, paddingLeft: '12px' }}>
          {/* Destacar visualmente que esta tarea está asignada al usuario actual */}
          {isAssignedToCurrentUser && (
            <Badge.Ribbon 
              text="Tu tarea" 
              color={config.color}
              style={{ fontWeight: 500, fontSize: '12px' }}
            />
          )}
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <Text strong style={{ color: '#262626', fontSize: '16px', fontWeight: 600 }}>{task.nameTask}</Text>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {(canChangeTaskStatus(task) || canDeleteTask(task)) && (
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
              {task.assignedTo && (
                <Tooltip title={`Asignado a: ${getMemberName(task.assignedTo)}`}>
                  <Avatar 
                    size="small" 
                    icon={<UserOutlined />} 
                    style={{ 
                      backgroundColor: isAssignedToCurrentUser ? config.color : '#8c8c8c',
                      marginRight: '8px'
                    }} 
                  />
                </Tooltip>
              )}
              
              {/* Mostrar nombre de usuario asignado */}
              {task.assignedTo && (
                <Text style={{ 
                  fontSize: '12px', 
                  fontWeight: isAssignedToCurrentUser ? 600 : 400,
                  color: isAssignedToCurrentUser ? config.color : '#8c8c8c',
                  marginRight: '8px'
                }}>
                  {getMemberName(task.assignedTo)}
                </Text>
              )}
              
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

  // Verificar si hay tareas e tota
  const hasTasks = tasks.length > 0;
  
  const hasUserTasks = tasks.some(task => task.assignedTo === currentUserId);

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

  const renderUserTasksSection = () => {
    if (!hasUserTasks) return null;
    
    const userTasks = tasks.filter(task => task.assignedTo === currentUserId);
    
    return (
      <div style={{ marginBottom: '40px' }}>
        <Title level={3} style={{ color: '#262626', fontWeight: 600, margin: '0 0 20px' }}>
          Tus tareas asignadas
        </Title>
        
        <Row gutter={[24, 24]}>
          {userTasks.map(task => (
            <Col xs={24} sm={12} lg={8} xl={6} key={`user-task-${task.id}`}>
              {renderTaskCard(task)}
            </Col>
          ))}
        </Row>
        
        <Divider style={{ margin: '40px 0 20px' }} />
      </div>
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
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={2} style={{ color: '#262626', fontWeight: 600, margin: '0 0 8px' }}>Tareas del Grupo</Title>
      </div>
      
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <Spin size="large" tip="Cargando tareas..." />
        </div>
      ) : !hasTasks ? (
        renderEmptyState()
      ) : (
        <>
          {renderUserTasksSection()}
          
          <Title level={3} style={{ color: '#262626', fontWeight: 600, margin: '0 0 20px' }}>
            Todas las tareas por estado
          </Title>
          
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
        </>
      )}
      
      {isUserType1 && (
        <Button
          type="primary"
          shape="circle"
          icon={<PlusOutlined />}
          size="large"
          style={{
            position: 'fixed',
            bottom: '40px',
            right: '40px',
            background: 'linear-gradient(135deg, #b388ff 0%, #7c4dff 100%)',
            borderColor: '#7c4dff',
            width: '60px',
            height: '60px',
            fontSize: '22px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 4px 16px rgba(124, 77, 255, 0.4)',
            transition: 'all 0.3s'
          }}
          onClick={() => setModalVisible(true)}
        />
      )}
      
      <NewTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onTaskCreated={fetchTasks}
        groupId={groupId}
        groupMembers={groupMembers}
      />
    </div>
  );
};

export default DashboardPage;