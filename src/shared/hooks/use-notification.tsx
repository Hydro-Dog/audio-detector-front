import { createContext } from 'react';
import { notification } from 'antd';
import { ArgsProps } from 'antd/es/notification';

const Context = createContext({ name: 'Default' });

export const useNotification = () => {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = ({ type, message, description, placement, ...rest }: ArgsProps) => {
    let notificationApiCall = null;

    if (type === 'error') {
      notificationApiCall = api.error;
    } else if (type === 'info') {
      notificationApiCall = api.info;
    } else if (type === 'success') {
      notificationApiCall = api.success;
    } else if (type === 'warning') {
      notificationApiCall = api.warning;
    }

    notificationApiCall!({
      message,
      description: <Context.Consumer>{({ name }) => description}</Context.Consumer>,
      placement: 'bottomRight',
      ...rest,
    });
  };

  return {
    openNotification,
    NotificationContext: () => (
      <Context.Provider value={{ name: 'snackbar_context' }}>{contextHolder}</Context.Provider>
    ),
  };
};
