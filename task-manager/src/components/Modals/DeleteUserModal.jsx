import React from "react";
import { Modal } from "antd";
import ModalFooter from "./Common/ModalFooter";

const DeleteUserModal = ({ visible, onConfirm, onCancel }) => {
  return (
    <Modal
      title="Eliminar Usuario"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={400}
    >
      <p>¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.</p>
      <ModalFooter
        onCancel={onCancel}
        submitText="Eliminar"
        onSubmit={onConfirm}
      />
    </Modal>
  );
};

export default DeleteUserModal;
