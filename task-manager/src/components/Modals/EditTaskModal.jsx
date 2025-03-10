import React, { useEffect } from 'react';
import { Modal, Form } from 'antd';
import moment from 'moment';
import TaskForm from './Common/TaskForm';
import ModalFooter from './Common/ModalFooter';

const EditTaskModal = ({ 
  visible, 
  onCancel, 
  onUpdateTask, 
  currentTask, 
  isUserType1, 
  groupMembers 
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (currentTask && visible) {
      const formattedTask = {
        ...currentTask,
        deadline: currentTask.deadline ? moment(currentTask.deadline) : null
      };
      form.setFieldsValue(formattedTask);
    }
  }, [currentTask, form, visible]);

  const handleSubmit = (values) => {
    onUpdateTask(values);
  };

  return (
    <Modal
      title="Editar Tarea"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <TaskForm 
        form={form}
        onFinish={handleSubmit}
        members={groupMembers}
        isEditing={true}
        isUserType1={isUserType1}
      />
      <ModalFooter 
        form={form} 
        onCancel={onCancel} 
        submitText="Actualizar" 
      />
    </Modal>
  );
};

export default EditTaskModal;