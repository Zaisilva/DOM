import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Avatar, Spin, Divider, Tag, message, Typography, Alert } from 'antd';
import { UserOutlined, SearchOutlined, InfoCircleOutlined } from '@ant-design/icons';
import debounce from 'lodash/debounce';
import api from '../services/api';

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

const NewTeamModal = ({ visible, onClose, team, onTeamCreated }) => {
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await api.get('/users/me');
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };
    if (visible) {
      fetchCurrentUser();
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
  const searchUsers = debounce(async (value) => {
    if (!value || value.length < 2) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    try {
      setSearching(true);
      const response = await api.get(`/users/search?q=${value}`);
      const filteredResults = response.data.filter(
        user => !selectedUsers.some(selected => selected.id === user.id)
      );
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setSearching(false);
    }
  }, 500);
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    searchUsers(value);
  };
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
    if (selectedUsers.length === 0) {
      message.error('Debes seleccionar al menos un miembro para el equipo');
      return;
    }
    try {
      const teamData = {
        ...values,
        members: selectedUsers.map(user => user.id)
      };

      if (team) {
        await api.put(`/teams/${team.id}`, teamData);
        message.success('Equipo actualizado correctamente');
      } else {
        await api.post('/teams/create', teamData);
        message.success('Equipo creado correctamente');
      }
      onTeamCreated();
    } catch (error) {
      console.error('Error saving team:', error);
      message.error('Error al guardar el equipo');
    }
  };
  return (
    <Modal
      title={team ? "Editar Equipo" : "Nuevo Equipo"}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      style={{ borderRadius: '16px' }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
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
        <Divider orientation="left">Miembros del Equipo</Divider>
                <Alert
          message="Busca y selecciona usuarios para añadirlos a tu equipo"
          description="Los usuarios que ya forman parte del equipo no aparecerán en los resultados de búsqueda."
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
          style={{ 
            marginBottom: '16px', 
            borderRadius: '8px',
            border: '1px solid #e9d8fd',
            backgroundColor: '#f5f0ff'
          }}
        />

        <div style={{ marginBottom: '16px' }}>
          <Select
            showSearch
            value={searchTerm}
            placeholder="Buscar usuarios por nombre, correo o username"
            style={{ width: '100%', borderRadius: '8px' }}
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onSearch={handleSearchChange}
            onChange={handleSearchChange}
            notFoundContent={searching ? <Spin size="small" /> : "No se encontraron usuarios"}
            suffixIcon={<SearchOutlined />}
            dropdownStyle={{ borderRadius: '8px' }}
            dropdownRender={menu => (
              <div>
                {menu}
                {searchResults.length > 0 && (
                  <div style={{ padding: '8px 12px', color: '#7a43b6', fontSize: '12px', borderTop: '1px solid #e9d8fd' }}>
                    Haz clic en un usuario para añadirlo al equipo
                  </div>
                )}
              </div>
            )}
          >
            {searchResults.map(user => (
              <Option key={user.id} value={user.name} label={user.name}>
                <div 
                  style={{ display: 'flex', alignItems: 'center', padding: '4px 0' }}
                  onClick={() => handleSelectUser(user)}
                >
                  <Avatar size="small" icon={<UserOutlined />} src={user.avatar} />
                  <div style={{ marginLeft: '8px', flex: 1 }}>
                    <div style={{ fontWeight: '500' }}>{user.name}</div>
                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                      {user.email} {user.username && `· @${user.username}`}
                    </div>
                  </div>
                </div>
              </Option>
            ))}
          </Select>
        </div>

        <div style={{ 
          marginBottom: '20px', 
          background: '#f9f0ff', 
          borderRadius: '8px', 
          padding: '16px',
          border: '1px solid #e9d8fd'
        }}>
          <Text strong style={{ display: 'block', marginBottom: '12px', color: '#7a43b6' }}>
            Miembros seleccionados:
          </Text>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {selectedUsers.length > 0 ? (
              selectedUsers.map(user => (
                <Tag
                  key={user.id}
                  closable
                  onClose={() => handleRemoveUser(user.id)}
                  style={{ 
                    padding: '5px 10px',
                    borderRadius: '16px',
                    backgroundColor: user.id === currentUser?.id ? '#e9d8fd' : '#f5f0ff',
                    borderColor: '#b388ff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Avatar 
                    size="small" 
                    icon={<UserOutlined />} 
                    src={user.avatar}
                  />
                  <div>
                    <span style={{ color: '#7a43b6' }}>{user.name}</span>
                    {user.id === currentUser?.id && (
                      <span style={{ fontSize: '11px', color: '#9c64d8', marginLeft: '4px' }}>(Tú)</span>
                    )}
                  </div>
                </Tag>
              ))
            ) : (
              <div style={{ textAlign: 'center', width: '100%', color: '#7a43b6', padding: '16px 0' }}>
                No hay usuarios seleccionados
              </div>
            )}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Button 
            style={{ marginRight: 8, borderRadius: '8px' }} 
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button 
            type="primary" 
            htmlType="submit"
            style={{
              backgroundColor: '#b388ff',
              borderRadius: '8px',
              border: 'none',
              boxShadow: '0 2px 10px rgba(179, 136, 255, 0.3)'
            }}
          >
            {team ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
export default NewTeamModal;