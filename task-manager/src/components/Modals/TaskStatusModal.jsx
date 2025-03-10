import React from 'react';
import { Modal, Form, Select, Button, message } from 'antd';
import { STATUS_CONFIG } from '../Common/Status';
import { updateTaskStatus } from '../../services/taskService'; 

const { Option } = Select;

const TaskStatusModal = ({ 
  visible, 
  onCancel, 
  onStatusChange, 
  currentTask, 
  refreshTasks 
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible && currentTask) {
      form.setFieldsValue({
        status: currentTask.status
      });
    }
  }, [visible, currentTask, form]);

  const handleSubmit = async (values) => {
    try {
      if (!currentTask) return;
      
      await updateTaskStatus(currentTask.id, values.status);
      message.success('Estado de la tarea actualizado correctamente');
      
      if (onStatusChange) {
        onStatusChange(values.status);
      }
      
      if (refreshTasks) {
        refreshTasks();
      }
      onCancel();
    } catch (error) {
      message.error('Error al actualizar el estado de la tarea');
      console.error('Error updating task status:', error);
    }
  };

  return (
    <Modal
      title="Cambiar Estado de la Tarea"
      open={visible}
      onCancel={onCancel}
      footer={null}
      centered
      destroyOnClose={true}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="status"
          label="Nuevo Estado"
          rules={[{ required: true, message: 'Por favor selecciona un estado' }]}
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
        
        <Form.Item style={{ marginTop: '24px', textAlign: 'right' }}>
          <Button 
            type="default" 
            onClick={onCancel} 
            style={{ marginRight: '8px' }}
          >
            Cancelar
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            style={{
            background: '#b388ff', borderColor: '#b388ff'
            }}
          >
            Guardar Cambio
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskStatusModal;
