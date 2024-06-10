import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Input, Modal } from 'antd';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { AppDispatch, RootState, User, updateCurrentUser } from '@store/index';
import { useDispatch, useSelector } from 'react-redux';
import { useNotificationContext } from '@shared/index';

const { Item } = Form;

//TODO: вынести в отдельный файл
const userProfileFormSchema = z.object({
  email: z.string().email({ message: 'Email is invalid' }).min(1, { message: 'Login is required' }),
  firstName: z.string().min(1, { message: 'firstName is required' }),
  lastName: z.string().min(1, { message: 'lastName is required' }),
  telegramUsername: z.string().min(1, { message: 'telegramUsername is required' }),
  phoneNumber: z
    .string()
    .regex(/^\d+$/, { message: 'Digits only' })
    .min(10, { message: 'Exactly 10 digits long' })
    .max(10, { message: 'Exactly 10 digits long' }),
});

//TODO: вынести в отдельный файл
type UserProfileFormType = z.infer<typeof userProfileFormSchema>;

type Props = {
  isModalOpened: boolean;
  onOk: () => void;
  onCancel: () => void;
};

export const UserFormModal = ({ isModalOpened, onOk, onCancel }: Props) => {
  const {
    currentUser,
    editCurrentUserStatus,
    currentUserStatus,
    currentUserError,
    editCurrentUserError,
  } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<UserProfileFormType>({
    resolver: zodResolver(userProfileFormSchema),
    reValidateMode: 'onChange',
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      telegramUsername: '',
      phoneNumber: '',
    },
  });

  useEffect(() => {
    if (currentUser) {
      setValue('email', currentUser.email);
      setValue('firstName', currentUser.firstName);
      setValue('lastName', currentUser.lastName);
      setValue('telegramUsername', currentUser.telegramUsername);
      setValue('phoneNumber', currentUser.phoneNumber);
    }
  }, [currentUser, setValue]);

  const onSubmit: SubmitHandler<UserProfileFormType> = (data) => {
    dispatch(updateCurrentUser(data as User));
  };

  const { openNotification } = useNotificationContext();

  useEffect(() => {
    if (currentUserStatus === 'error' || editCurrentUserStatus === 'error') {
      openNotification({
        type: 'error',
        message: 'Ошибка',
        description: (currentUserError || editCurrentUserError)!.errorMessage,
      });
    }
  }, [currentUserStatus, editCurrentUserStatus, openNotification]);

  return (
    <Modal title="Edit user" open={isModalOpened} footer={null} onCancel={onCancel}>
      <form className="m-auto" onSubmit={handleSubmit(onSubmit)}>
        <Item<UserProfileFormType>
          validateStatus={errors.firstName ? 'error' : ''}
          help={errors.firstName?.message}>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => <Input {...field} placeholder="First Name" />}
          />
        </Item>

        <Item<UserProfileFormType>
          validateStatus={errors.lastName ? 'error' : ''}
          help={errors.lastName?.message}>
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Last Name" />}
          />
        </Item>

        <Item<UserProfileFormType>
          validateStatus={errors.email ? 'error' : ''}
          help={errors.email?.message}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Email" />}
          />
        </Item>

        <Item<UserProfileFormType>
          validateStatus={errors.telegramUsername ? 'error' : ''}
          help={errors.telegramUsername?.message}>
          <Controller
            name="telegramUsername"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Telegram username" />}
          />
        </Item>

        <Item<UserProfileFormType>
          validateStatus={errors.phoneNumber ? 'error' : ''}
          help={errors.phoneNumber?.message}>
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Phone number" />}
          />
        </Item>

        <Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={editCurrentUserStatus === 'loading' || currentUserStatus === 'loading'}>
            Submit
          </Button>
        </Item>
      </form>
    </Modal>
  );
};
