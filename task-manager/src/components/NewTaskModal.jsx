import React from 'react';
import { Modal, Form, Input, DatePicker, Select, message } from 'antd';
import api from '../services/api';

const { TextArea } = Input;

const NewTaskModal = ({ visible, onClose, onTaskCreated }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
        await api.post('/tasks/create', values);
        message.success('Tarea creada exitosamente');
      form.resetFields();
      onTaskCreated();
      onClose();
    } catch (error) {
      message.error('Error al crear la tarea');
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
      </Form>
    </Modal>
  );
};
export default NewTaskModal;
