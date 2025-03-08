import api from '../services/api';
import { message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export const fetchTasks = async (groupId, setTasks, setLoading) => {
  try {
    setLoading(true);
    const response = await api.get(`tasks/list/${groupId}`);
    setTasks(response.data);
  } catch (error) {
    message.error('Error al cargar las tareas');
    console.error('Error fetching tasks:', error);
  } finally {
    setLoading(false);
  }
};

export const deleteTask = async (taskId, fetchTasks) => {
  Modal.confirm({
    title: '¿Estás seguro de eliminar esta tarea?',
    icon: <ExclamationCircleOutlined />,
    content: 'Esta acción no se puede deshacer',
    okText: 'Sí, eliminar',
    okType: 'danger',
    cancelText: 'Cancelar',
    onOk: async () => {
      try {
        await api.delete(`/tasks/${taskId}`);
        message.success('Tarea eliminada correctamente');
        fetchTasks();
      } catch (error) {
        message.error('Error al eliminar la tarea');
      }
    }
  });
};

export const updateTask = async (taskId, values, isUserType1, fetchTasks, setEditModalVisible) => {
  try {
    if (!isUserType1) {
      await api.put(`/tasks/${taskId}/status`, { status: values.status });
    } else {
      await api.put(`/tasks/${taskId}`, {
        ...values,
        deadline: values.deadline ? values.deadline.format('YYYY-MM-DD') : null
      });
    }
    
    message.success('Tarea actualizada correctamente');
    setEditModalVisible(false);
    fetchTasks();
  } catch (error) {
    message.error('Error al actualizar la tarea');
  }
};
