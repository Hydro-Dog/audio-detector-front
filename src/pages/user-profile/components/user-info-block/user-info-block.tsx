import { useThemeToken } from '@shared/index';

type Props = {
  title: string;
  text: string;
};

export const UserInfoBlock = ({ title, text }: Props) => {
  const token = useThemeToken();

  return (
    <div className="w-full flex gap-1">
      <div className="" style={{ color: token.colorTextDescription }}>
        {title}
      </div>
      <div style={{ color: token.colorTextHeading }}>{text}</div>
    </div>
  );
};
