import React from 'react';

interface HeaderPropsType {
  children?: React.ReactNode;
}

export default function Header({ children }: HeaderPropsType) {
  return (
    <div className='header container'>
      {children}
    </div>
  );
}
