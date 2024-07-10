import CloseIcon from '@mui/icons-material/Close';
import { useThemeToken } from '@shared/index';
import { Button, Tooltip, Typography } from 'antd';
import { PropsWithChildren, ReactNode, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CSSTransition } from 'react-transition-group';
import './responsive-modal.css';
import { useOnClickOutside } from 'usehooks-ts';

const { Title } = Typography;

type Props = {
  onOk: (...val: any) => any;
  onCancel: (...val: any) => any;
  title: ReactNode;
  footer?: ReactNode[];
  open: boolean;
};

export const ResponsiveModal = ({
  onOk,
  onCancel,
  footer,
  children,
  open,
  ...props
}: PropsWithChildren<Props>) => {
  const themeToken = useThemeToken();
  const { t } = useTranslation();

  const title =
    typeof props.title === 'string' ? <Title level={4}>{props.title}</Title> : props.title;

  const nodeRef = useRef(null);

  const ref = useRef(null);

  const handleClickOutside = () => {
    // Your custom logic here
    // console.log('clicked outside');
  };

  const handleClickInside = () => {
    // Your custom logic here
    // console.log('clicked inside');
  };

  // useOnClickOutside(ref, handleClickOutside);

  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={open}
      timeout={300}
      classNames="responsive-fallback"
      unmountOnExit>
      <div
        ref={nodeRef}
        className="fixed top-0 left-0 w-screen h-screen bg-gray-950 bg-opacity-40 z-10">
        <div
          ref={ref}
          style={{ background: themeToken.colorBgContainer }}
          className="absolute bottom-0 left-0 w-full z-10 fit-content px-6 py-5 rounded-t-lg flex flex-col gap-1">
          <div className="flex justify-between">
            {title}
            <div onClick={onCancel}>
              <CloseIcon sx={{ fill: themeToken.colorText }} />
            </div>
          </div>
          {children}
          <div className="flex gap-2 justify-end">
            {footer ? (
              footer?.map((item) => item)
            ) : (
              <>
                <Button size="large" key="back" onClick={onCancel}>
                  {t('CANCEL', { ns: 'phrases' })}
                </Button>
                <Button size="large" type="primary" onClick={onOk}>
                  {t('OK', { ns: 'phrases' })}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};
