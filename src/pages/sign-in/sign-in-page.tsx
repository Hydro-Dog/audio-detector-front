import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppDispatch, RootState, UserLoginDTO, loginUser, setLoginStatus } from '@store/index';
import { Button, Form, Input, Tooltip, Typography } from 'antd';
import { z } from 'zod';
import { useNotificationContext, useThemeToken } from '@shared/index';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@shared/enum';
import { FETCH_STATUS } from '@store/types/fetch-status';
import { useTranslation } from 'react-i18next';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const { Item } = Form;
const { Text } = Typography;

//TODO: вынести в отдельный файл
const useSignInFormSchema = () => {
  const { t } = useTranslation();

  return z.object({
    login: z.string().min(1, { message: t('ERRORS.REQUIRED', { ns: 'phrases' }) }),
    password: z
      .string()
      .min(8, { message: t('ERRORS.PASSWORD_TOO_SHORT', { length: '8 символов', ns: 'phrases' }) })
      .max(20, { message: t('ERRORS.PASSWORD_TOO_LONG', { ns: 'phrases' }) }),
  });
};

//TODO: вынести в отдельный файл

export const SignInPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loginStatus, loginError } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const { openNotification } = useNotificationContext();
  const { t } = useTranslation();
  const themeToken = useThemeToken();
  const signInFormSchema = useSignInFormSchema();
  type SignInFormType = z.infer<typeof signInFormSchema>;

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
      openNotification({
        type: 'error',
        message: t('ERROR', { ns: 'phrases' }),
        description: loginError?.errorMessage,
      });
    } else if (loginStatus === FETCH_STATUS.SUCCESS) {
      dispatch(setLoginStatus(FETCH_STATUS.IDLE));
      navigate('/');
    }
  }, [dispatch, loginError?.errorMessage, loginStatus, navigate, openNotification, t]);

  return (
    <div className="flex w-full h-screen" style={{ background: themeToken.colorBgBase }}>
      <Form
        className="m-auto"
        labelCol={{ span: 8 }}
        labelAlign="left"
        labelWrap
        colon={false}
        wrapperCol={{ span: 16 }}
        onFinish={handleSubmit(onSubmit)}>
        <Item<SignInFormType>
          label={
            <Tooltip title={t('SIGN_IN.LOGIN_PLACEHOLDER')}>
              {t('LOGIN', { ns: 'phrases' })}
              <HelpOutlineIcon className="!h-4" />
            </Tooltip>
          }
          validateStatus={errors.login ? 'error' : ''}
          help={errors.login?.message}>
          <Controller
            name="login"
            control={control}
            render={({ field }) => (
              <div className="flex">
                <Input {...field} placeholder={t('SIGN_IN.LOGIN_PLACEHOLDER')} />
              </div>
            )}
          />
        </Item>

        <Item<SignInFormType>
          label={t('PASSWORD', { ns: 'phrases' })}
          validateStatus={errors.password ? 'error' : ''}
          help={errors.password?.message}>
          <Controller
            name="password"
            control={control}
            render={({ field }) => {
              return <Input.Password {...field} placeholder={t('PASSWORD', { ns: 'phrases' })} />;
            }}
          />
        </Item>

        <div className="flex items-center justify-between">
          <Item className="m-0">
            <Button type="primary" htmlType="submit" loading={loginStatus === 'loading'}>
              {t('ENTER', { ns: 'phrases' })}
            </Button>
          </Item>
          <Tooltip title={t('SIGN_IN.FORGOT_PASSWORD_TOOLTIP')}>
            <Text type="secondary" className="cursor-pointer">
              {t('FORGOT_PASSWORD', { ns: 'phrases' })}?
            </Text>
          </Tooltip>
          {/* <Button type="text" onClick={() => navigate(`/${ROUTES.REGISTER}`)}>
            {t('REGISTER', { ns: 'phrases' })}
          </Button> */}
        </div>
      </Form>
    </div>
  );
};
