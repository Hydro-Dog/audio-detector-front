import { useEffect, useState } from 'react';
import { Avatar, Button, Card, FloatButton, Modal, Tooltip } from 'antd';
import { UserFormModal } from './components/user-form-modal';
import { useBoolean } from 'usehooks-ts';
import { AppDispatch, RootState, fetchCurrentUser } from '@store/index';
import { useDispatch, useSelector } from 'react-redux';
import { Spin } from 'antd';
import { UserInfoBlock } from './components/user-info-block/user-info-block';
import Meta from 'antd/es/card/Meta';
import { EditOutlined } from '@ant-design/icons';

export const UserProfilePage = () => {
  const { value: isModalOpened, setTrue: openModal, setFalse: closeModal } = useBoolean(false);
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser, currentUserStatus } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  const showModal = () => {
    openModal();
  };

  const handleOk = () => {
    closeModal();
  };

  const handleCancel = () => {
    closeModal();
  };

  if (currentUserStatus === 'error') {
    <div>error</div>;
  }

  const userData = {
    firstName: currentUser?.firstName,
    lastName: currentUser?.lastName,
    email: currentUser?.email,
    phoneNumber: currentUser?.phoneNumber,
    telegramUsername: currentUser?.telegramUsername,
  };

  return (
    <div className="w-full h-full flex">
      <div className="m-auto flex flex-col gap-2 items-end">
        <Card
          style={{ width: 320, marginTop: 16 }}
          loading={currentUserStatus === 'loading' || currentUserStatus === 'idle'}>
          <div>
            {Object.entries(userData).map(([key, val]) => (
              <UserInfoBlock title={key} text={val!} key={key} />
            ))}
          </div>
        </Card>
        <Tooltip title="tooltip text">
          <Button type="text" icon={<EditOutlined />} onClick={showModal}>
            Edit
          </Button>
        </Tooltip>
        <UserFormModal isModalOpened={isModalOpened} onOk={handleOk} onCancel={handleCancel} />
      </div>
    </div>
  );
};
