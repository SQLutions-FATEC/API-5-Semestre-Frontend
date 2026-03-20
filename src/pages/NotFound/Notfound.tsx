import React from 'react';
import './NotFound.scss';

const NotFound: React.FC = () => {
  return (
    <div className="not-found-container">
      <h1>404</h1>
      <h2>Página não encontrada</h2>
      <p>Desculpe, a página que você está procurando não existe ou foi movida.</p>
    </div>
  );
};

export default NotFound;
