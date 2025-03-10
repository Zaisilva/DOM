import React from 'react';
import { ActionButton } from '../../Common/Buttons'; // Import your ActionButton

export const ModalFooter = ({ onCancel, form, submitText = "Guardar", submitting }) => {
  const handleSubmit = (e) => {
    if (submitting) {
      e.preventDefault();
      return;
    }
    
    form.submit();
  };

  const handleCancel = (e) => {
    if (submitting) {
      e.preventDefault();
      return;
    }
    
    onCancel();
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
      <ActionButton 
        type="delete" 
        onClick={handleCancel}
        style={submitting ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
      >
        Cancelar
      </ActionButton>
      
      <ActionButton 
        type="edit" 
        onClick={handleSubmit}
        style={submitting ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
      >
        {submitText} {submitting && "..."}
      </ActionButton>
    </div>
  );
};

export default ModalFooter;