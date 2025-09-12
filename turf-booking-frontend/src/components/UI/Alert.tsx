import React from 'react';

interface Props {
  message: string;
}

const Alert: React.FC<Props> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="p-3 bg-red-100 text-red-700 rounded-lg text-center">
      {message}
    </div>
  );
};

export default Alert;
