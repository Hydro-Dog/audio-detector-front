import { useParams } from 'react-router-dom';
import { BackButton } from '@shared/components';
import { Card, Table } from 'antd';
import { CallHistory, UserProfile } from './components';

export const UserPage = () => {
  const { id } = useParams();
  const userData = {}; // Получить данные пользователя по ID
  const callHistory = []; // Получить историю вызовов

  const historyColumns = [
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Address', dataIndex: 'address', key: 'address' },
  ];

  //TODO: рефакторинг верстки, перейти на flex gap, tailwind css
  return (
    <div style={{ margin: 10 }}>
      <BackButton style={{ marginBottom: 20 }} />
      <UserProfile />
      <CallHistory />
    </div>
  );
};
