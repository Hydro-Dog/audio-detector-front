import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { zodResolver } from '@hookform/resolvers/zod';
import { AppDispatch, RootState } from '@store/index';
import { registerUser } from '@store/index';
import { Button, Form, Input, theme as antdTheme, notification } from 'antd';
import { z } from 'zod';
import { RegisterOk } from './components/register-ok/register-ok';
import { createContext } from 'react';
import { useNotification } from '@shared/index';

const { Item } = Form;

const Context = createContext({ name: 'Default' });

//TODO: вынести в отдельный файл
const registerFormSchema = z.object({
  email: z.string().email({ message: 'Email is invalid' }).min(1, { message: 'Login is required' }),
  password: z
    .string()
    .min(8, { message: 'Password is too short' })
    .max(20, { message: 'Password is too long' }),
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
type RegisterFormType = z.infer<typeof registerFormSchema>;

export const RegisterPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { registerUserError, registerUserStatus } = useSelector((state: RootState) => state.user);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormType>({
    resolver: zodResolver(registerFormSchema),
    reValidateMode: 'onChange',
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      telegramUsername: '',
      phoneNumber: '',
    },
  });

  const { openNotification, NotificationContext } = useNotification();

  const onSubmit: SubmitHandler<RegisterFormType> = (data) => {
    dispatch(registerUser(data)).catch((errorMessage) => {
      console.log('errorMessage: ', errorMessage);
      openNotification(errorMessage);
    });
  };

  if (registerUserStatus === 'success') {
    return <RegisterOk />;
  }

  return (
    <>
      <NotificationContext />
      <div className="flex w-full h-screen ">
        <form className="m-auto" onSubmit={handleSubmit(onSubmit)}>
          <Item<RegisterFormType>
            validateStatus={errors.firstName ? 'error' : ''}
            help={errors.firstName?.message}>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => <Input {...field} placeholder="First Name" />}
            />
          </Item>

          <Item<RegisterFormType>
            validateStatus={errors.lastName ? 'error' : ''}
            help={errors.lastName?.message}>
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Last Name" />}
            />
          </Item>

          <Item<RegisterFormType>
            validateStatus={errors.email ? 'error' : ''}
            help={errors.email?.message}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Email" />}
            />
          </Item>

          <Item<RegisterFormType>
            validateStatus={errors.telegramUsername ? 'error' : ''}
            help={errors.telegramUsername?.message}>
            <Controller
              name="telegramUsername"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Telegram username" />}
            />
          </Item>

          <Item<RegisterFormType>
            validateStatus={errors.phoneNumber ? 'error' : ''}
            help={errors.phoneNumber?.message}>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Phone number" />}
            />
          </Item>

          <Item<RegisterFormType>
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password?.message}>
            <Controller
              name="password"
              control={control}
              render={({ field }) => {
                console.log('field: ', field);
                return <Input.Password {...field} placeholder="Password" />;
              }}
            />
          </Item>

          <Item>
            <Button type="primary" htmlType="submit" loading={registerUserStatus === 'loading'}>
              Submit
            </Button>
          </Item>
        </form>
      </div>
    </>
  );
};
