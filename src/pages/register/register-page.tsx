import { useEffect } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { ROUTES, useNotificationContext } from '@shared/index';
import { AppDispatch, RootState } from '@store/index';
import { registerUser } from '@store/index';
import { Button, Form, Input } from 'antd';
import { z } from 'zod';
import { RegisterOk } from './components/register-ok/register-ok';

const { Item } = Form;

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
  const navigate = useNavigate();
  const { openNotification } = useNotificationContext();
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

  const onSubmit: SubmitHandler<RegisterFormType> = (data) => {
    dispatch(registerUser(data));
  };

  useEffect(() => {
    if (registerUserStatus === 'error') {
      openNotification({
        type: 'error',
        message: 'Error',
        description: registerUserError?.errorMessage,
      });
    }
  }, [openNotification, registerUserStatus]);

  if (registerUserStatus === 'success') {
    return <RegisterOk />;
  }

  return (
    <>
      <div className="flex w-full h-screen ">
        <Form
          className="m-auto"
          labelCol={{ span: 12 }}
          labelAlign="left"
          labelWrap
          colon={false}
          wrapperCol={{ span: 12 }}
          onFinish={handleSubmit(onSubmit)}>
          <Item<RegisterFormType>
            label="First name"
            validateStatus={errors.firstName ? 'error' : ''}
            help={errors.firstName?.message}>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => <Input {...field} placeholder="First Name" />}
            />
          </Item>

          <Item<RegisterFormType>
            label="Last name"
            validateStatus={errors.lastName ? 'error' : ''}
            help={errors.lastName?.message}>
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Last Name" />}
            />
          </Item>

          <Item<RegisterFormType>
            label="Email"
            validateStatus={errors.email ? 'error' : ''}
            help={errors.email?.message}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Email" />}
            />
          </Item>

          <Item<RegisterFormType>
            label="Telegram username"
            validateStatus={errors.telegramUsername ? 'error' : ''}
            help={errors.telegramUsername?.message}>
            <Controller
              name="telegramUsername"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Telegram username" />}
            />
          </Item>

          <Item<RegisterFormType>
            label="Phone number"
            validateStatus={errors.phoneNumber ? 'error' : ''}
            help={errors.phoneNumber?.message}>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Phone number" />}
            />
          </Item>

          <Item<RegisterFormType>
            label="Password"
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password?.message}>
            <Controller
              name="password"
              control={control}
              render={({ field }) => {
                return <Input.Password {...field} placeholder="Password" />;
              }}
            />
          </Item>

          <div className="flex justify-between">
            <Item>
              <Button type="primary" htmlType="submit" loading={registerUserStatus === 'loading'}>
                Submit
              </Button>
            </Item>
            <Button type="text" onClick={() => navigate(`/${ROUTES.SIGN_IN}`)}>
              Sign in
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};
