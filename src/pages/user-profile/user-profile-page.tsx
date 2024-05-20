import { useState } from 'react';
import { Button, Modal } from 'antd';
import { UserFormModal } from './components/user-form-modal';
import { useBoolean } from 'usehooks-ts';

export const UserProfilePage = () => {
  const { value: isModalOpened, setTrue: openModal, setFalse: closeModal } = useBoolean(false);

  const showModal = () => {
    openModal();
  };

  const handleOk = () => {
    closeModal();
  };

  const handleCancel = () => {
    closeModal();
  };

  return (
    <div>
      data
      <Button onClick={showModal}>Редактировать</Button>
      <UserFormModal isModalOpened={isModalOpened} onOk={handleOk} onCancel={handleCancel} />
    </div>
  );
};
