import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FETCH_STATUS, fetchUser, RootState } from '@store/index';
import { Button, Card, Collapse, Typography } from 'antd';
import { useParams } from 'react-router-dom';

const { Title } = Typography;

export const UserProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user, fetchUserStatus } = useSelector((state: RootState) => state.user);
  const [showDetails, setShowDetails] = useState(true); // Using '1' as the default active key

  useEffect(() => {
    dispatch(fetchUser(id));
  }, [dispatch, id]);

  return !showDetails ? (
    <div className="flex justify-between px-6 py-4">
      <Title level={5}>User Profile</Title>
      <Button onClick={() => setShowDetails(!showDetails)}>More</Button>
    </div>
  ) : (
    <Card
      title="User Profile"
      style={{ marginBottom: 20 }}
      loading={fetchUserStatus === FETCH_STATUS.LOADING}
      extra={<Button onClick={() => setShowDetails(!showDetails)}>More</Button>}>
      <p>Name: {user?.fullName}</p>
      <p>Email: {user?.email}</p>
      <p>Phone: {user?.phoneNumber}</p>
    </Card>
  );
};
