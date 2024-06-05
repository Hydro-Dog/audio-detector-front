import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppDispatch, RootState, UserLoginDTO, loginUser, setLoginStatus } from '@store/index';
import { Button, Form, Input } from 'antd';
import { z } from 'zod';
import { useNotificationContext } from '@shared/index';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@shared/enum';

const { Item } = Form;

//TODO: вынести в отдельный файл
const signInFormSchema = z.object({
  login: z.string().min(1, { message: 'Login is required' }),
  password: z
    .string()
    .min(8, { message: 'Password is too short' })
    .max(20, { message: 'Password is too long' }),
});

//TODO: вынести в отдельный файл
type SignInFormType = z.infer<typeof signInFormSchema>;

export const SignInPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loginStatus, loginError } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const { openNotification } = useNotificationContext();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserLoginDTO>({
    resolver: zodResolver(signInFormSchema),
    reValidateMode: 'onChange',
    mode: 'onSubmit',
    defaultValues: {
      login: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<SignInFormType> = (data) => {
    dispatch(loginUser(data));
  };

  useEffect(() => {
    if (loginStatus === 'error') {
      openNotification({ type: 'error', message: 'Ошибка', description: loginError?.errorMessage });
    } else if (loginStatus === 'success') {
      dispatch(setLoginStatus('idle'));
      navigate('/');
    }
  }, [dispatch, loginError?.errorMessage, loginStatus, navigate, openNotification]);

  return (
    <div className="flex w-full h-screen ">
      <form className="m-auto" onSubmit={handleSubmit(onSubmit)}>
        <Item<SignInFormType>
          validateStatus={errors.login ? 'error' : ''}
          help={errors.login?.message}>
          <Controller
            name="login"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Enter your login, email or phone number" />
            )}
          />
        </Item>

        <Item<SignInFormType>
          validateStatus={errors.password ? 'error' : ''}
          help={errors.password?.message}>
          <Controller
            name="password"
            control={control}
            render={({ field }) => {
              return <Input.Password {...field} placeholder="Enter your password" />;
            }}
          />
        </Item>

        <Item>
          <Button type="primary" htmlType="submit" loading={loginStatus === 'loading'}>
            Submit
          </Button>
        </Item>
      </form>
    </div>
  );
};
