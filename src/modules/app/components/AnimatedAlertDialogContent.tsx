import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import { cn } from "./ui/utils";
import { X } from 'lucide-react';
import { Button } from '@/modules/app/components/ui/button';

interface AnimatedAlertDialogContentProps {
  children: React.ReactNode;
  className?: string;
  onClose: () => void;
  hideScrollbar?: boolean;
}

const AnimatedAlertDialogContent: React.FC<AnimatedAlertDialogContentProps> = ({
  children,
  className,
  onClose,
  hideScrollbar = true,
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
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleAnimationEnd = () => {
    if (!isOpen) {
      setIsMounted(false);
      onClose();
    }
  };

  if (!isMounted) return null;

  return createPortal(
    <>
      {/* 遮罩层 - 无动画 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={handleClose}
        />
      )}

      {/* 内容层 - 纯缩放动画 */}
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
            "w-[calc(100vw-2px)] h-[calc(100vh-2px)] max-w-[calc(100vw-2px)] max-h-[calc(100vh-2px)]",
            "bg-[#0F171E] border-gray-800",
            className,
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 关闭按钮 - 相对于外层定位，不跟随滚动 */}
          <Button
            onClick={handleClose}
            className="absolute top-2 right-6 z-50 bg-gray-900/70 border border-gray-600 text-white hover:bg-gray-800 w-6 h-6 rounded-md flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </Button>

          {/* 内部滚动容器 */}
          <div className={cn("overflow-auto h-full", hideScrollbar ? "scrollbar-hide" : undefined)}>
            {children}
          </div>
        </div>
      </CSSTransition>
    </>,
    document.body
  );
};

export default AnimatedAlertDialogContent;
