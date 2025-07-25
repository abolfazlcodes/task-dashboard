import useClickOutside from '@/hooks/useClickOutside';
import React, { ReactNode, useEffect, useState, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, className }) => {
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(isOpen);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useClickOutside(modalRef, {
    onOutsideClick: active ? onClose : undefined,
    onEscape: active ? onClose : undefined,
    enabled: visible,
  });

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setTimeout(() => setActive(true), 10);
    } else if (visible) {
      setActive(false);
      const timeout = setTimeout(() => setVisible(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!visible) return null;

  return (
    <div
      className={`fixed flex-col inset-0 z-50 flex items-center justify-center transition-all duration-400 ${active ? 'backdrop-blur-sm bg-black/30 opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <div
        ref={modalRef}
        data-testid="modal-backdrop"
        className={`transition-all duration-400 overflow-auto task-form-scroll ${active ? 'scale-100 opacity-100' : 'scale-95 opacity-0'} bg-[var(--color-bg-paper)] ${className || ''}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
