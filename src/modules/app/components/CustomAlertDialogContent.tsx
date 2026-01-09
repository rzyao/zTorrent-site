import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import { cn } from "./ui/utils";

interface CustomAlertDialogContentProps {
  children: React.ReactNode;
  className?: string;
  onPointerDownOutside?: (event: React.PointerEvent) => void;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
}

const CustomAlertDialogContent: React.FC<CustomAlertDialogContentProps> = ({ 
  children, 
  className,
  onPointerDownOutside,
  onEscapeKeyDown
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const nodeRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 组件挂载后立即显示动画
    setIsMounted(true);
    const timer = setTimeout(() => setIsOpen(true), 10);
    
    // 监听ESC键
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onEscapeKeyDown?.(e);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onEscapeKeyDown]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleAnimationEnd = () => {
    if (!isOpen) {
      setIsMounted(false);
    }
  };

  if (!isMounted) return null;

  return createPortal(
    <>
      {/* 遮罩层 */}
      <CSSTransition
        nodeRef={nodeRef}
        in={isOpen}
        timeout={300}
        classNames="fade-transition"
        unmountOnExit={true}
        appear={true}
      >
        <div 
          className="fixed inset-0 z-40 bg-black/50"
          onClick={handleClose}
        />
      </CSSTransition>
      
      {/* 内容层 */}
      <CSSTransition
        nodeRef={nodeRef}
        in={isOpen}
        timeout={300}
        classNames="scale-transition"
        unmountOnExit={true}
        appear={true}
        onExited={handleAnimationEnd}
      >
        <div
          ref={nodeRef}
          className={cn(
            "fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg",
            "w-[calc(100vw-100px)] h-[calc(100vh-100px)] max-w-[calc(100vw-100px)] max-h-[calc(100vh-100px)]",
            "bg-[#0F171E] border-gray-800 overflow-auto",
            className,
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </CSSTransition>
    </>,
    document.body
  );
};

export default CustomAlertDialogContent;