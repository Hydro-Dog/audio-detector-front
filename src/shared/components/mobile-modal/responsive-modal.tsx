import CloseIcon from '@mui/icons-material/Close';
import { useThemeToken } from '@shared/index';
import { Button, Tooltip, Typography } from 'antd';
import { PropsWithChildren, ReactNode } from 'react';

const { Title } = Typography;

type Props = {
  onCancel: (...val: any) => any;
  title: ReactNode;
  footer: ReactNode[];
  open: boolean;
};

export const ResponsiveModal = ({
  onCancel,
  footer,
  children,
  open,
  ...props
}: PropsWithChildren<Props>) => {
  const themeToken = useThemeToken();

  const title =
    typeof props.title === 'string' ? <Title level={4}>{props.title}</Title> : props.title;

  if (!open) {
    return null;
  }

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-gray-950 bg-opacity-40 z-10">
      <div
        style={{ background: themeToken.colorBgContainer }}
        className="absolute bottom-0 left-0 w-full z-10 fit-content px-6 py-5 rounded-t-lg flex flex-col gap-1">
        <div className="flex justify-between">
          {title}
          <div onClick={onCancel}>
            <CloseIcon sx={{ fill: themeToken.colorText }} />
          </div>
        </div>
        {children}
        <div className="flex gap-2 justify-end">{footer.map((item) => item)}</div>
      </div>
    </div>
  );
};
