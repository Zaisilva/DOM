import React from 'react';
import { Form, Input, DatePicker, Select } from 'antd';
import { STATUS_CONFIG } from '../../Common/Status';

const { TextArea } = Input;
const { Option } = Select;

const TaskForm = ({ 
  form, 
  onFinish, 
  members = [], 
  isEditing = false, 
  isUserType1 = true,
  initialStatus = "In Progress",
  isPersonalTask = false
}) => {
  return (
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
        <Input className="custom-input" disabled={isEditing && !isUserType1} />
      </Form.Item>
      
      <Form.Item
        name="description"
        label="Descripción"
      >
        <TextArea rows={4} className="custom-input" disabled={isEditing && !isUserType1} />
      </Form.Item>
      
      <Form.Item
        name="status"
        label="Estado"
        initialValue={initialStatus}
      >
        <Select className="custom-input">
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
      
      <Form.Item
        name="deadline"
        label="Fecha Límite"
      >
        <DatePicker 
          showTime 
          format="DD/MM/YYYY HH:mm"
          style={{ width: '100%' }}
          className="custom-input"
        />
      </Form.Item>
      
      <Form.Item
        name="category"
        label="Categoría"
      >
        <Select className="custom-input" allowClear>
          <Option value="Urgente">Urgente</Option>
          <Option value="Importante">Importante</Option>
          <Option value="Recordatorio">Recordatorio</Option>
          <Option value="Seguimiento">Seguimiento</Option>
        </Select>
      </Form.Item>
      
      {/* Solo mostrar el campo de asignar cuando NO es una tarea personal */}
      {!isPersonalTask && (
        <Form.Item
          name={isEditing ? "assignedTo" : "assignedUserId"}
          label="Asignar a"
          rules={[{ required: true, message: 'Por favor asigna un responsable' }]}
        >
          <Select 
            className="custom-input"
            placeholder="Seleccionar miembro"
            loading={members.length === 0}
          >
            {members.map(member => (
              <Option 
                key={member.id || member.userId} 
                value={member.id || member.userId}
              >
                {member.name || member.displayName || member.email}
              </Option>
            ))}
          </Select>
        </Form.Item>
      )}
    </Form>
  );
};

export default TaskForm;