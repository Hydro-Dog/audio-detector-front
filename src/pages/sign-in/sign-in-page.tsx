import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Input } from 'antd';
import { z } from 'zod';

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
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignInFormType>({
    resolver: zodResolver(signInFormSchema),
    reValidateMode: 'onChange',
    mode: 'onSubmit',
    defaultValues: {
      login: '',
      password: '',
    },
  });
  const onSubmit: SubmitHandler<SignInFormType> = (data) => {
    console.log('onSubmit: ', data);
  };

  console.log('errors: ', errors);

  return (
    <div className="flex w-full h-screen ">
      <form className="m-auto form-style" onSubmit={handleSubmit(onSubmit)}>
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
              console.log('field: ', field);
              return <Input.Password {...field} placeholder="Enter your password" />;
            }}
          />
        </Item>

        <Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Item>
      </form>
    </div>
  );
};
