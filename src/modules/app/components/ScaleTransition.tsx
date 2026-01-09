import React from 'react';
import { CSSTransition } from 'react-transition-group';

interface ScaleTransitionProps {
  children: React.ReactNode;
  isOpen: boolean;
  timeout?: number;
  className?: string;
}

const ScaleTransition: React.FC<ScaleTransitionProps> = ({ 
  children, 
  isOpen,
  className,
  timeout = 300 
}) => {
  const nodeRef = React.useRef<HTMLDivElement>(null);

  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={isOpen}
      timeout={timeout}
      classNames="scale-transition"
      unmountOnExit={true}
      appear={true}
    >
      <div ref={nodeRef} className={className}>
        {children}
      </div>
    </CSSTransition>
  );
};

export default ScaleTransition;