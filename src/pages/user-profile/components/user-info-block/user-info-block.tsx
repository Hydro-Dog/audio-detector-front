import { useThemeToken } from '@shared/index';

type Props = {
  title: string;
  text: string;
};

export const UserInfoBlock = ({ title, text }: Props) => {
  const themeToken = useThemeToken();

  return (
    <div className="w-full flex gap-1">
      <div className="" style={{ color: themeToken.colorTextDescription }}>
        {title}
      </div>
      <div style={{ color: themeToken.colorTextHeading }}>{text}</div>
    </div>
  );
};
