import api from '../services/api';
import { message, Modal } from 'antd';


export const deleteTask = async (taskId, callback) => {
  try {
    await api.delete(`/tasks/eliminar/${taskId}`);
    if (typeof callback === 'function') {
      callback();
    }
  } catch (error) {
    console.error(error);
  }
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


export const updateTaskStatus = async (taskId, status) => {
  try {
    const response = await api.put(`/tasks/status/${taskId}`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating task status:', error);
    throw error;
  }
};



export const fetchTasks = async (groupId, setTasks, setLoading) => {
  try {
    setLoading(true);
    const response = await api.get(`tasks/list/${groupId}`);
    // Asegurar que todas las tareas tienen el groupId correcto
    const tasksWithGroupId = response.data.map(task => ({
      ...task,
      groupId: groupId // Asegurar que el groupId está presente
    }));
    setTasks(tasksWithGroupId);
  } catch (error) {
    message.error('Error al cargar las tareas');
    console.error('Error fetching tasks:', error);
  } finally {
    setLoading(false);
  }
};

export const fetchPersonalTasks = async (setTasks, setLoading) => {
  try {
    setLoading(true);
    const response = await api.get('/tasks/personal/list');
    setTasks(response.data);
  } catch (error) {
    message.error('Error al cargar las tareas personales');
    console.error('Error fetching personal tasks:', error);
  } finally {
    setLoading(false);
  }
};

export const createTask = async (taskData, form, onTaskCreated, onClose) => {
  try {
    const taskWithGroupData = {
      ...taskData,
      isPersonal: false, 
      groupId: taskData.groupId 
    };
    
    console.log("Creating group task with data:", taskWithGroupData);
    
    const response = await api.post('/tasks/create', taskWithGroupData);
    console.log("Task created response:", response.data);
    
    message.success('Tarea creada exitosamente');
    form.resetFields();
    onTaskCreated(); 
    onClose();
  } catch (error) {
    message.error('Error al crear la tarea');
    console.error(error);
  }
};

export const createPersonalTask = async (taskData, form, onTaskCreated, onClose) => {
  try {
    // Asegurarse de que la tarea personal tiene isPersonal=true y NO tiene groupId
    const personalTaskData = {
      ...taskData,
      isPersonal: true,
      groupId: null // Asegurarse de que no tiene groupId
    };
    
    await api.post('/tasks/personal/create', personalTaskData);
    message.success('Tarea personal creada exitosamente');
    form.resetFields();
    onTaskCreated();
    onClose();
  } catch (error) {
    message.error('Error al crear la tarea personal');
    console.error(error);
  }
};