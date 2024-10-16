// src/CursosDaMaquina.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './styles.css';

function CursosDaMaquina() {
    const { id } = useParams(); // Obtém o ID da máquina da URL
    const [cursos, setCursos] = useState([]);
    const [nomeMaquina, setNomeMaquina] = useState(''); // Estado para armazenar o nome da máquina

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Busca os cursos
                const cursosResponse = await fetch('http://localhost:8000/api/cursos');
                const cursosData = await cursosResponse.json();
                const cursosFiltrados = cursosData.filter(curso =>
                    curso.maquina.includes(parseInt(id))
                );
                setCursos(cursosFiltrados);

                // Busca o nome da máquina
                const maquinaResponse = await fetch(`http://localhost:8000/api/maquinas/${id}`);
                const maquinaData = await maquinaResponse.json();
                setNomeMaquina(maquinaData.nomeMaquina); // Supondo que a resposta tenha o campo 'nomeMaquina'
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        };

        fetchData(); // Faz a chamada para buscar os dados
    }, [id]);

    return (
        <div className="cursos-da-maquina-content">
            <h2 className="cursos-da-maquina-header">Cursos da {nomeMaquina}</h2>
            {cursos.length > 0 ? (
                cursos.map(curso => {
                    const progressPercent = curso.progresso || 0; // Supondo que 'progresso' seja um campo do curso
                    return (
                        <div key={curso.idcurso} className="curso-item">
                            <h3 className="curso-titulo">{curso.titulo}</h3>
                            <p className="curso-descricao">{curso.descricao}</p>
                            <div className="curso-progress-container">
                                <div className="curso-progress-bar-container">
                                    <div className="curso-progress-bar" style={{ width: `${progressPercent}%` }}></div>
                                </div>
                                <div className="curso-progress-text">{progressPercent}%</div>
                            </div>
                        </div>
                    );
                })
            ) : (
                <p className="curso-sem-cursos">Nenhum curso encontrado para esta máquina.</p>
            )}
        </div>
    );
}

export default CursosDaMaquina;
