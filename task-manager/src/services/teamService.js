import api from './api';

export const fetchTeams = async (setTeams, setLoading) => {
  try {
    setLoading(true);
    const response = await api.get('/teams/list');
    setTeams(response.data);
  } catch (error) {
    console.error('Error fetching teams:', error);
  } finally {
    setLoading(false);
  }
};

export const deleteTeam = async (teamId, fetchTeams) => {
  try {
    await api.delete(`/teams/${teamId}`);
    fetchTeams();
  } catch (error) {
    console.error('Error deleting team:', error);
  }
};

export const fetchGroupData = async (groupId, setGroupData, setGroupMembers, setLoading) => {
  try {
    setLoading(true);
    const [groupResponse, membersResponse] = await Promise.all([
      api.get(`/teams/${groupId}`),
      api.get(`/teams/${groupId}/members`)
    ]);
    
    setGroupData(groupResponse.data);
    setGroupMembers(membersResponse.data);
  } catch (error) {
    console.error('Error fetching group data:', error);
  } finally {
    setLoading(false);
  }
};
