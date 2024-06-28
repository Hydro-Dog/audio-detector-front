import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppDispatch, RootState, UserLoginDTO, loginUser, setLoginStatus } from '@store/index';
import { Button, Form, Input } from 'antd';
import { z } from 'zod';
import { useNotificationContext, useThemeToken } from '@shared/index';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@shared/enum';
import { FETCH_STATUS } from '@store/types/fetch-status';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

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
    if (loginStatus === FETCH_STATUS.ERROR) {
      openNotification({ type: 'error', message: 'Ошибка', description: loginError?.errorMessage });
    } else if (loginStatus === FETCH_STATUS.SUCCESS) {
      dispatch(setLoginStatus(FETCH_STATUS.IDLE));
      navigate('/');
    }
  }, [dispatch, loginError?.errorMessage, loginStatus, navigate, openNotification]);

  return (
    <div className="flex w-full h-screen ">
      <Form
        className="m-auto"
        labelCol={{ span: 8 }}
        labelAlign="left"
        labelWrap
        colon={false}
        wrapperCol={{ span: 16 }}
        onFinish={handleSubmit(onSubmit)}>
        <Item<SignInFormType>
          label="Email"
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
          label="Password"
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

        <div className="flex justify-between">
          <Item>
            <Button type="primary" htmlType="submit" loading={loginStatus === 'loading'}>
            {t('SUBMIT', { ns: 'phrases' })}
            </Button>
          </Item>
          <Button type="text" onClick={() => navigate(`/${ROUTES.REGISTER}`)}>
            {t('REGISTER', { ns: 'phrases' })}
          </Button>
        </div>
      </Form>
    </div>
  );
};
