import React, { useState, useEffect } from 'react';
import CadastroTreinamento from '../CadastroTreinamento';
import CadastroAulas from '../CadastroAulas';
import CadastroMaquinas from '../CadastroMaquinas';
import CadastroUsuarios from '../CadastroUsuarios';
import CadastroArea from '../CadastroAreas';
import CadastroQuestionario from '../CadastroQuestionario';
import './styles.css';  

function NavbarPage() {
  const [currentPage, setCurrentPage] = useState('treinamento');

  useEffect(() => {
    setCurrentPage('treinamento'); // Defina a página inicial após o login
  }, []);

  return (
    <div className="navbar-page-container">
      {/* Navbar fixa no topo */}
      <nav className="navbar">
        <button onClick={() => setCurrentPage('treinamento')}>Cadastrar Cursos</button>
        <button onClick={() => setCurrentPage('aulas')}>Cadastrar Aulas</button>
        <button onClick={() => setCurrentPage('maquinas')}>Cadastrar Máquinas</button>
        <button onClick={() => setCurrentPage('novo usuario')}>Cadastrar Usuários</button>
        <button onClick={() => setCurrentPage('area')}>Cadastrar Áreas</button>
        <button onClick={() => setCurrentPage('questionario')}>Cadastrar Questionarios</button>
      </nav>

      {/* Conteúdo dinâmico abaixo da navbar */}
      <div className="page-content">
        {currentPage === 'treinamento' && <CadastroTreinamento />}
        {currentPage === 'aulas' && <CadastroAulas />}
        {currentPage === 'maquinas' && <CadastroMaquinas />}
        {currentPage === 'novo usuario' && <CadastroUsuarios />}
        {currentPage === 'area' && <CadastroArea />}
        {currentPage === 'questionario' && <CadastroQuestionario />}
      </div>
    </div>
  );
}

export default NavbarPage;
