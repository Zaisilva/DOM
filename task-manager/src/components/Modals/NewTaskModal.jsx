import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker, Select, Button } from 'antd';
import { createTask, createPersonalTask } from '../../services/taskService';
import moment from 'moment';
import { STATUS_CONFIG } from '../Common/Status';
const { Option } = Select;
const { TextArea } = Input;

const NewTaskModal = ({ 
  visible, 
  onClose, 
  onTaskCreated, 
  groupId = null, 
  groupMembers = [] 
}) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Determinar si estamos creando una tarea personal o de grupo
  const isPersonalTask = !groupId;

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();
      
      const taskData = {
        ...values,
        deadline: values.deadline ? values.deadline.format('YYYY-MM-DD') : null,
        // Si es una tarea personal, asignarse a uno mismo
        assignedUserId: isPersonalTask ? JSON.parse(localStorage.getItem('userData') || '{}').userId : values.assignedUserId,
        // Si es tarea de grupo, incluir el groupId
        groupId: isPersonalTask ? null : groupId,
        // Marcar explícitamente si es personal o no
        isPersonal: isPersonalTask
      };
      
      
      if (isPersonalTask) {
        await createPersonalTask(taskData, form, onTaskCreated, onClose);
      } else {
        await createTask(taskData, form, onTaskCreated, onClose);
      }
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title={isPersonalTask ? "Nueva Tarea Personal" : "Nueva Tarea de Grupo"}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button 
          key="cancel" 
          onClick={onClose}
          style={{
            marginRight: 8,
            borderRadius: '8px',
          }}
        >
          Cancelar
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          onClick={handleSubmit}
          loading={isSubmitting}
          style={{
            backgroundColor: '#b388ff',
            borderRadius: '8px',
            border: 'none',
            boxShadow: '0 2px 10px rgba(179, 136, 255, 0.3)',
          }}
        >
          Crear Tarea
        </Button>
      ]}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="nameTask"
          label="Nombre de la tarea"
          rules={[{ required: true, message: 'Por favor ingrese el nombre de la tarea' }]}
        >
          <Input placeholder="Nombre de la tarea" />
        </Form.Item>
        
        <Form.Item
          name="description"
          label="Descripción"
        >
          <TextArea rows={4} placeholder="Descripción de la tarea" />
        </Form.Item>
        
        <Form.Item
          name="deadline"
          label="Fecha límite"
        >
          <DatePicker 
            style={{ width: '100%' }} 
            format="DD/MM/YYYY"
            placeholder="Seleccionar fecha" 
          />
        </Form.Item>
        
        <Form.Item
          name="status"
          label="Estado"
          initialValue="In Progress"
        >
          <Select>
            {Object.keys(STATUS_CONFIG).map(status => (
              <Option key={status} value={status}>
                {STATUS_CONFIG[status].label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item
          name="category"
          label="Categoría"
        >
          <Select placeholder="Seleccionar categoría">
            <Option value="general">General</Option>
            <Option value="work">Trabajo</Option>
            <Option value="study">Estudio</Option>
            <Option value="health">Salud</Option>
            <Option value="home">Hogar</Option>
            <Option value="other">Otro</Option>
          </Select>
        </Form.Item>
        
        {/* Mostrar el selector de usuario asignado solo para tareas de grupo */}
        {!isPersonalTask && (
          <Form.Item
            name="assignedUserId"
            label="Asignar a"
            rules={[{ required: true, message: 'Por favor seleccione un miembro' }]}
          >
            <Select placeholder="Seleccionar miembro">
              {groupMembers.map(member => (
                <Option key={member.id} value={member.id}>
                  {member.name || member.email || `Usuario ${member.id}`}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default NewTaskModal;