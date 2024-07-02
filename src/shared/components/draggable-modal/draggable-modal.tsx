import React, { Dispatch, PropsWithChildren, ReactNode, SetStateAction, useRef, useState } from 'react';
import type { DraggableData, DraggableEvent } from 'react-draggable';
import Draggable from 'react-draggable';
import { PropsWithChildrenOnly } from '@shared/types';
import { Button, Modal } from 'antd';

type Props = {
  open: boolean;
  title?: ReactNode;
  width?: string | number;
  onOk: () => void;
  onCancel: () => void;
};

export const DraggableModal = ({ children, open, title, width, onOk, onCancel }: PropsWithChildren<Props>) => {
  const [disabled, setDisabled] = useState(true);
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
  const draggleRef = useRef<HTMLDivElement>(null);

  const handleOk = (e: React.MouseEvent<HTMLElement>) => {
    onOk();
  };

  const handleCancel = (e: React.MouseEvent<HTMLElement>) => {
    onCancel()
  };

  const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

  return (
    <>
      <Modal
        width={width || 'fit-content'}
        mask={false}
        title={
          <div
            style={{

              width: '90%',
              cursor: 'move',
            }}
            onMouseOver={() => {
              if (disabled) {
                setDisabled(false);
              }
            }}
            onMouseOut={() => {
              setDisabled(true);
            }}>
            {title}
          </div>
        }
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        modalRender={(modal) => (
          <Draggable
            disabled={disabled}
            bounds={bounds}
            nodeRef={draggleRef}
            onStart={(event, uiData) => onStart(event, uiData)}>
            <div ref={draggleRef} className='h-40'>{modal}</div>
          </Draggable>
        )}>
        {children}
      </Modal>
    </>
  );
};
