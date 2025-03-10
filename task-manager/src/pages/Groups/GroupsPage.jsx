import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { fetchTeams } from '../../services/teamService';
import GroupCard from '../../components/Cards/GroupCard';
import PageTitle from '../../components/Common/PageTitle';
import LoadingScreen from '../../components/Common/LoadingScreen'; 
import EmptyState from '../../components/EmptyState';

const GroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeams(setGroups, setLoading);
  }, []);

  const handleGroupClick = (groupId) => {
    navigate('/dashboard', { 
      state: { groupId } 
    });
  };

  return (
    <div style={{ 
      padding: '24px', 
      maxWidth: '1400px', 
      margin: '0 auto',
      backgroundColor: '#f9f9fb',
      minHeight: '100vh'
    }}>
      <PageTitle 
        title="Mis Grupos" 
        subtitle="Selecciona un grupo para ver y gestionar sus tareas"
      />
      
      {loading ? (
        <LoadingScreen 
          tip="Cargando" 
          subtext="Obteniendo grupos..."
        />
      ) : (
        <>
          {groups.length > 0 ? (
            <Row gutter={[24, 28]}>
              {groups.map(group => (
                <Col xs={24} sm={12} lg={8} xl={6} key={group.id}>
                  <GroupCard
                    group={group}
                    onClick={() => handleGroupClick(group.id)}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <EmptyState type="groups" />
          )}
        </>
      )}
    </div>
  );
};

export default GroupsPage;