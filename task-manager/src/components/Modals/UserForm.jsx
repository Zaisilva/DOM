import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import ModalFooter from './Common/ModalFooter';

const { Option } = Select;

const UserFormModal = ({ visible, onClose, user, onSave }) => {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState(user || {});

  useEffect(() => {
    if (user) {
      setFormData(user);
      form.setFieldsValue(user);
    } else {
      setFormData({ username: '', email: '', password: '', tipo: 2 });
    }
  }, [user, form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      onSave(formData);
      onClose();
    } catch (error) {
      message.error('Por favor, completa todos los campos.');
    }
  };

  return (
    <Modal
      title={user ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="username"
          label="Nombre de Usuario"
          rules={[{ required: true, message: 'Por favor ingresa el nombre de usuario' }]}
        >
          <Input
            name="username"
            value={formData.username || ''}
            onChange={handleChange}
          />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: 'Por favor ingresa el email' }]}
        >
          <Input
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Contraseña"
          rules={user ? [] : [{ required: true, message: 'Por favor ingresa la contraseña' }]}
        >
          <Input.Password
            name="password"
            value={formData.password || ''}
            onChange={handleChange}
            placeholder={user ? '(Dejar en blanco para mantener)' : ''}
          />
        </Form.Item>

        <Form.Item name="tipo" label="Rol">
          <Select
            name="tipo"
            value={formData.tipo || 2}
            onChange={(value) => setFormData({ ...formData, tipo: value })}
          >
            <Option value={1}>Administrador</Option>
            <Option value={2}>Usuario Regular</Option>
          </Select>
        </Form.Item>
          <ModalFooter
            onCancel={onClose}
            submitText={user ? 'Guardar' : 'Crear'}
            form={form} 
          />

      </Form>
    </Modal>
  );
};

export default UserFormModal;
