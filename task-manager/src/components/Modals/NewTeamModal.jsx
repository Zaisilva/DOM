import React, { useState, useEffect } from 'react';
import { Modal, Form, Divider, message } from 'antd';
import debounce from 'lodash/debounce';
import { createTeam, updateTeam } from '../../services/teamService'; 
import { fetchCurrentUser, searchUsers } from '../../services/usersService'; 
import ModalFooter from './Common/ModalFooter';
import UserSearch from './Common/UserSearch';
import SelectedMembersList from './Common/SelectedMembersList';
import TeamFormFields from './Common/TeamFormFields.jsx';
import InfoAlert from './Common/InfoAlert';

const NewTeamModal = ({ visible, onClose, team, onTeamCreated }) => {
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [submitting, setSubmitting] = useState(false); // Add a state to track submission

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await fetchCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    if (visible) {
      fetchUserData();
    }
  }, [visible]);

  useEffect(() => {
    if (team && visible) {
      form.setFieldsValue({
        name: team.name,
        description: team.description,
      });
      setSelectedUsers(team.members || []);
    } else if (!team && visible) {
      form.resetFields();
      setSelectedUsers(currentUser ? [currentUser] : []);
    }
  }, [team, visible, form, currentUser]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    searchUsersDebounced(value);
  };

  const searchUsersDebounced = debounce(async (value) => {
    if (!value || value.length < 2) {
      setSearchResults([]);
      setSearching(false);
      return;
    }
    
    try {
      setSearching(true);
      const results = await searchUsers(value);
      const filteredResults = results.filter(user => !selectedUsers.some(selected => selected.id === user.id));
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setSearching(false);
    }
  }, 500);

  const handleSelectUser = (user) => {
    if (!selectedUsers.some(selected => selected.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleRemoveUser = (userId) => {
    if (currentUser && currentUser.id === userId && !team) {
      message.warning('No puedes eliminarte a ti mismo del equipo');
      return;
    }
    setSelectedUsers(selectedUsers.filter(user => user.id !== userId));
  };

  const handleSubmit = async (values) => {
    // Prevent duplicate submissions
    if (submitting) return;
    
    if (selectedUsers.length === 0) {
      message.error('Debes seleccionar al menos un miembro para el equipo');
      return;
    }

    try {
      setSubmitting(true); // Set submitting state to true
      
      // Disable form submission buttons
      form.setFields([
        {
          name: '_submit_disabled_',
          value: true,
        },
      ]);
      
      const teamData = {
        ...values,
        members: selectedUsers.map(user => user.id),
      };

      if (team) {
        await updateTeam(team.id, teamData);
        message.success('Equipo actualizado correctamente');
      } else {
        await createTeam(teamData);
        message.success('Equipo creado correctamente');
      }
      
      // Only call these after successful API call
      onTeamCreated();
      onClose(); 
    } catch (error) {
      console.error('Error saving team:', error);
      message.error('Error al guardar el equipo');
    } finally {
      setSubmitting(false);
      
      // Re-enable form submission buttons
      form.setFields([
        {
          name: '_submit_disabled_',
          value: false,
        },
      ]);
    }
  };
  
  return (
    <Modal
      title={team ? "Editar Equipo" : "Nuevo Equipo"}
      open={visible}
      onCancel={submitting ? null : onClose} // Prevent closing during submission
      footer={null}
      width={600}
      style={{ borderRadius: '16px' }}
      maskClosable={!submitting}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <TeamFormFields />
        
        <Divider orientation="left">Miembros del Equipo</Divider>
        
        <InfoAlert />

        <UserSearch 
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
          searchResults={searchResults}
          searching={searching}
          handleSelectUser={handleSelectUser}
        />

        <SelectedMembersList 
          selectedUsers={selectedUsers}
          handleRemoveUser={handleRemoveUser}
          currentUser={currentUser}
        />
        
        <ModalFooter 
          form={form} 
          onCancel={onClose} 
          submitText={team ? 'Actualizar' : 'Crear'} 
          submitting={submitting} // Pass submitting state to ModalFooter
        />
      </Form>
    </Modal>
  );
};

export default NewTeamModal;