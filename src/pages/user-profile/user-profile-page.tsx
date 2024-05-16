import { useState } from 'react';
import { Button, Modal } from 'antd';
import { UserFormModal } from './components/user-form-modal';

export const UserProfilePage = () => {
  const [isModalOpened, setIsModalOpened] = useState(false);

  const showModal = () => {
    setIsModalOpened(true);
  };

  const handleOk = () => {
    setIsModalOpened(false);
  };

  const handleCancel = () => {
    setIsModalOpened(false);
  };

  return (
    <div>
      data
      <Button onClick={showModal}>Редактировать</Button>
      <UserFormModal isModalOpened={isModalOpened} onOk={handleOk} onCancel={handleCancel} />
    </div>
  );
};
