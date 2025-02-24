import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, DatePicker, Select, message } from 'antd';
import api from '../services/api';

const { TextArea } = Input;

const NewTaskModal = ({ visible, onClose, onTaskCreated, groupId, groupMembers }) => {
  const [form] = Form.useForm();
  const [members, setMembers] = useState([]);

  // Cargar los miembros del grupo si no se proporcionan
  useEffect(() => {
    const fetchGroupMembers = async () => {
      if (!groupMembers && groupId) {
        try {
          const response = await api.get(`/groups/${groupId}/members`);
          setMembers(response.data);
        } catch (error) {
          message.error('Error al cargar los miembros del grupo');
          console.error(error);
        }
      } else if (groupMembers) {
        setMembers(groupMembers);
      }
    };

    fetchGroupMembers();
  }, [groupId, groupMembers]);

  const onFinish = async (values) => {
    try {
      // Agregar el ID del grupo a los valores del formulario
      const taskData = {
        ...values,
        groupId: groupId,
        // Convertir la fecha a formato compatible con Firestore si existe
        deadline: values.deadline ? values.deadline.toDate() : null
      };

      await api.post('/tasks/create', taskData);
      message.success('Tarea creada exitosamente');
      form.resetFields();
      onTaskCreated();
      onClose();
    } catch (error) {
      message.error('Error al crear la tarea');
      console.error(error);
    }
  };

  return (
    <Modal
      title="Nueva Tarea"
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
      okButtonProps={{ style: { background: '#b388ff', borderColor: '#b388ff' } }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="nameTask"
          label="Nombre de la Tarea"
          rules={[{ required: true, message: 'Por favor ingresa el nombre' }]}
        >
          <Input className="custom-input" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Descripción"
        >
          <TextArea rows={4} className="custom-input" />
        </Form.Item>
        <Form.Item
          name="deadline"
          label="Fecha Límite"
        >
          <DatePicker 
            showTime 
            style={{ width: '100%' }}
            className="custom-input"
          />
        </Form.Item>
        <Form.Item
          name="status"
          label="Estado"
          initialValue="In Progress"
        >
          <Select className="custom-input">
            <Select.Option value="In Progress">En Progreso</Select.Option>
            <Select.Option value="Done">Completado</Select.Option>
            <Select.Option value="Paused">Pausado</Select.Option>
            <Select.Option value="Revision">En Revisión</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="category"
          label="Categoría"
        >
          <Input className="custom-input" />
        </Form.Item>
        <Form.Item
          name="assignedUserId"
          label="Asignar a"
          rules={[{ required: true, message: 'Por favor asigna un responsable' }]}
        >
          <Select 
            className="custom-input"
            placeholder="Seleccionar miembro"
            loading={members.length === 0}
          >
            {members.map(member => (
              <Select.Option key={member.id || member.userId} value={member.id || member.userId}>
                {member.name || member.displayName || member.email}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewTaskModal;