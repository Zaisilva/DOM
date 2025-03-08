import React from 'react';
import { ClockCircleOutlined, CheckCircleOutlined, PauseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const STATUS_CONFIG = {
  'In Progress': {
    label: 'En Progreso',
    color: '#1890ff',
    icon: <ClockCircleOutlined />,
    badgeStatus: 'processing'
  },
  'Done': {
    label: 'Completado',
    color: '#52c41a',
    icon: <CheckCircleOutlined />,
    badgeStatus: 'success'
  },
  'Paused': {
    label: 'Pausado',
    color: '#faad14',
    icon: <PauseCircleOutlined />,
    badgeStatus: 'warning'
  },
  'Revision': {
    label: 'En Revisión',
    color: '#ff4d4f',
    icon: <ExclamationCircleOutlined />,
    badgeStatus: 'error'
  }
};

export default STATUS_CONFIG;
