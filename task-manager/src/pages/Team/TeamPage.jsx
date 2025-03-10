import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import NewTeamModal from '../../components/Modals/NewTeamModal';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import { fetchTeams, deleteTeam } from '../../services/teamService';
import TeamCard from '../../components/Cards/TeamCard';
import EmptyState from '../../components/EmptyState';
import LoadingScreen from '../../components/Common/LoadingScreen'; 
import { ButtonCircle } from '../../components/Common/Buttons';
import PageTitle from '../../components/Common/PageTitle';

const TeamPage = () => {
  const [newTeamModalVisible, setNewTeamModalVisible] = useState(false);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTeam, setCurrentTeam] = useState(null);

  useEffect(() => {
    fetchTeams(setTeams, setLoading);
  }, []);

  const handleEdit = (team) => {
    setCurrentTeam(team);
    setNewTeamModalVisible(true);
  };

  const handleDelete = (team) => {
    ConfirmationModal({
      title: '¿Estás seguro que deseas eliminar este equipo?',
      content: 'Esta acción no se puede deshacer',
      onConfirm: () => deleteTeam(team.id, () => fetchTeams(setTeams, setLoading)),
    });
  };

  const handleCreateTeam = () => {
    setCurrentTeam(null);
    setNewTeamModalVisible(true);
  };

  const handleTeamCreated = () => {
    fetchTeams(setTeams, setLoading);
    setNewTeamModalVisible(false);
  };

  return (
    <div style={{ 
      padding: '32px', 
      maxWidth: '1400px', 
      margin: '0 auto',
      backgroundColor: '#fafafa',
      minHeight: '100vh'
    }}>
       <PageTitle 
        title="Mis Equipos"
        subtitle="Administra tus equipos y colaboradores"
      />
      <ButtonCircle onClick={handleCreateTeam} />

      {loading ? (
        <LoadingScreen 
          tip="Cargando" 
          subtext="Obteniendo equipos..."
        />
      ) : (
        <Row gutter={[24, 24]}>
          {teams.length > 0 ? (
            teams.map(team => (
              <Col xs={24} md={12} xl={8} key={team.id}>
                <TeamCard 
                  team={team} 
                  onEdit={handleEdit} 
                  onDelete={handleDelete} 
                />
              </Col>
            ))
          ) : (
            <Col span={24}>
              <EmptyState type="team" />
            </Col>
          )}
        </Row>
      )}
      
      <NewTeamModal
        visible={newTeamModalVisible}
        onClose={() => setNewTeamModalVisible(false)}
        team={currentTeam}
        onTeamCreated={handleTeamCreated}
      />
    </div>
  );
};

export default TeamPage;