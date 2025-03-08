import React, { useState, useEffect } from 'react';
import { Typography, Card, Row, Col, Button, Avatar, Empty, Dropdown, Menu, Modal, Spin, Tag, Tooltip } from 'antd';
import { 
  PlusOutlined, 
  TeamOutlined,
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined 
} from '@ant-design/icons';
import NewTeamModal from '../../components/NewTeamModal';
import { fetchTeams, deleteTeam } from '../../services/teamService';

const { Title, Text, Paragraph } = Typography;

const TeamPage = () => {
  const [newTeamModalVisible, setNewTeamModalVisible] = useState(false);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTeam, setCurrentTeam] = useState(null);

  useEffect(() => {
    fetchTeams(setTeams, setLoading);
  }, []);



const handleMenuClick = (team, action) => {
  if (action === 'delete') {
    Modal.confirm({
      title: '¿Estás seguro que deseas eliminar este equipo?',
      content: 'Esta acción no se puede deshacer',
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: () => deleteTeam(team.id, () => fetchTeams(setTeams, setLoading)),
    });
  }
};

  const renderTeamCard = (team) => {
    const teamMenu = (
      <Menu>
        <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => handleMenuClick(team, 'edit')}>
          Editar equipo
        </Menu.Item>
        <Menu.Item key="delete" icon={<DeleteOutlined />} danger onClick={() => handleMenuClick(team, 'delete')}>
          Eliminar equipo
        </Menu.Item>
      </Menu>
    );

    return (
      <Card 
        key={team.id}
        style={{ 
          borderRadius: '16px',
          marginBottom: '20px',
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
          border: '1px solid #f0f0f0',
          overflow: 'hidden'
        }}
        hoverable
      >
        <div 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            height: '6px', 
            background: '#b388ff' 
          }}
        />
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          paddingTop: '10px' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar.Group 
              maxCount={4} 
              maxStyle={{ 
                backgroundColor: '#b388ff',
                color: '#fff' 
              }}
            >
              {team.members.map(member => (
                <Tooltip key={member.id} title={member.name}>
                  <Avatar 
                    src={member.avatar} 
                    icon={<UserOutlined />} 
                    style={{ border: '2px solid #f5f0ff' }}
                  />
                </Tooltip>
              ))}
            </Avatar.Group>
            <div style={{ marginLeft: '16px' }}>
              <Title level={4} style={{ margin: 0, color: '#333' }}>{team.name}</Title>
              <Text type="secondary">
                {team.members.length} {team.members.length === 1 ? 'miembro' : 'miembros'}
              </Text>
            </div>
          </div>
          <Dropdown overlay={teamMenu} trigger={['click']} placement="bottomRight">
            <Button 
              type="text" 
              icon={<EllipsisOutlined style={{ fontSize: '20px' }} />} 
            />
          </Dropdown>
        </div>
        
        {team.description && (
          <Paragraph 
            style={{ 
              marginTop: '20px', 
              color: '#555',
              backgroundColor: '#fafafa',
              padding: '12px',
              borderRadius: '8px'
            }}
          >
            {team.description}
          </Paragraph>
        )}
        
        <div style={{ 
          marginTop: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          {team.members.map(member => (
            <Tooltip key={member.id} title={member.username ? `@${member.username}` : member.email}>
              <Tag
                color="#f5f0ff"
                style={{ 
                  padding: '6px 10px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#7a43b6',
                  border: '1px solid #e9d8fd'
                }}
              >
                <Avatar 
                  size="small" 
                  icon={<UserOutlined />} 
                  src={member.avatar}
                />
                {member.name}
              </Tag>
            </Tooltip>
          ))}
        </div>
        
        {team.tags && team.tags.length > 0 && (
          <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {team.tags.map(tag => (
              <Tag 
                key={tag} 
                color="#b388ff" 
                style={{ 
                  marginBottom: '0',
                  borderRadius: '12px',
                  padding: '2px 10px',
                  color: '#fff'
                }}
              >
                {tag}
              </Tag>
            ))}
          </div>
        )}
      </Card>
    );
  };

  return (
    <div style={{ 
      padding: '32px', 
      maxWidth: '1400px', 
      margin: '0 auto',
      backgroundColor: '#fafafa',
      minHeight: '100vh'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '36px' 
      }}>
        <div>
          <Title level={2} style={{ margin: 0, color: '#333' }}>Mis Equipos</Title>
          <Text type="secondary">Administra tus equipos y colaboradores</Text>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => {
            setCurrentTeam(null);
            setNewTeamModalVisible(true);
          }}
          style={{
            backgroundColor: '#b388ff',
            borderRadius: '8px',
            border: 'none',
            boxShadow: '0 2px 10px rgba(179, 136, 255, 0.3)'
          }}
        >
          Nuevo Equipo
        </Button>
      </div>
      
      {loading ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '60vh',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <Spin size="large" />
          <Text type="secondary">Cargando equipos...</Text>
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {teams.length > 0 ? (
            teams.map(team => (
              <Col xs={24} md={12} xl={8} key={team.id}>
                {renderTeamCard(team)}
              </Col>
            ))
          ) : (
            <Col span={24}>
              <Card 
                style={{ 
                  textAlign: 'center', 
                  padding: '56px 48px', 
                  borderRadius: '16px',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)'
                }}
              >
                <TeamOutlined style={{ 
                  fontSize: '56px', 
                  color: '#b388ff', 
                  marginBottom: '20px' 
                }} />
                <Title level={3} style={{ color: '#333' }}>Sin equipos aún</Title>
                <Paragraph style={{ fontSize: '16px', color: '#666' }}>
                  Crea tu primer equipo para empezar a colaborar
                </Paragraph>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => setNewTeamModalVisible(true)}
                  style={{
                    backgroundColor: '#b388ff',
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 2px 10px rgba(179, 136, 255, 0.3)',
                    marginTop: '20px',
                    height: '40px',
                    fontSize: '16px'
                  }}
                >
                  Crear Equipo
                </Button>
              </Card>
            </Col>
          )}
        </Row>
      )}

      <NewTeamModal
        visible={newTeamModalVisible}
        onClose={() => setNewTeamModalVisible(false)}
        team={currentTeam}
        onTeamCreated={() => {
          fetchTeams(setTeams, setLoading);
          setNewTeamModalVisible(false);
        }}
        
      />
    </div>
  );
};

export default TeamPage;