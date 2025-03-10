import React from 'react';
import { Form, Input } from 'antd';

const { TextArea } = Input;

export const TeamFormFields = () => {
  return (
    <>
      <Form.Item
        name="name"
        label="Nombre del Equipo"
        rules={[{ required: true, message: 'Por favor ingresa un nombre para el equipo' }]}
      >
        <Input 
          placeholder="Ingresa el nombre del equipo" 
          style={{ borderRadius: '8px' }}
        />
      </Form.Item>

      <Form.Item
        name="description"
        label="Descripción"
      >
        <TextArea 
          rows={3} 
          placeholder="Describe el propósito de este equipo"
          style={{ borderRadius: '8px' }}
        />
      </Form.Item>
    </>
  );
};

export default TeamFormFields;