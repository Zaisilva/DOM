import { Modal } from 'antd';

const ConfirmationModal = ({ title, content, onConfirm }) => {
  return Modal.confirm({
    title,
    content,
    okText: 'Eliminar',
    okType: 'danger',
    cancelText: 'Cancelar',
    onOk: onConfirm,
  });
};

export default ConfirmationModal;