import React, { Dispatch, PropsWithChildren, SetStateAction, useRef, useState } from 'react';
import type { DraggableData, DraggableEvent } from 'react-draggable';
import Draggable from 'react-draggable';
import { PropsWithChildrenOnly } from '@shared/types';
import { Button, Modal } from 'antd';

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const DraggableModal = ({ children, open, setOpen }: PropsWithChildren<Props>) => {
  const [disabled, setDisabled] = useState(true);
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
  const draggleRef = useRef<HTMLDivElement>(null);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e);
    setOpen(false);
  };

  const handleCancel = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e);
    setOpen(false);
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
      mask={false}
        title={
          <div
            style={{
              width: '100%',
              cursor: 'move',
            }}
            onMouseOver={() => {
              if (disabled) {
                setDisabled(false);
              }
            }}
            onMouseOut={() => {
              setDisabled(true);
            }}
            >
            Draggable Modal
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
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}>
        {children}
      </Modal>
    </>
  );
};
