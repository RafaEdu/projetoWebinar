import React, { useState, useEffect } from 'react';
import './style.css'; // Mantendo o estilo igual aos outros
import { useLocation } from 'react-router-dom';
import NavbarPage from '../CadastrosNavbar';

function CadastroAula() {
  const [titulo, setTitulo] = useState('');
  const [horas, setHoras] = useState('');
  const [minutos, setMinutos] = useState('');
  const [segundos, setSegundos] = useState('');
  const [tipo, setTipo] = useState(''); // Armazena 'video' ou 'slide'
  const [video, setVideo] = useState(null); // Para armazenar o vídeo
  const [slide, setSlide] = useState(null); // Para armazenar o PDF
  const [curso, setCurso] = useState([]); // Para armazenar os cursos
  const [selectedCurso, setSelectedCurso] = useState(''); // Para armazenar o curso selecionado
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const aulaParaEditar = location.state?.dadosEdicao; // Recebe os dados do item para edição

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const cursosResponse = await fetch('http://localhost:8000/api/cursos/');
        
        if (!cursosResponse.ok) {
          throw new Error('Erro ao buscar dados dos cursos');
        }

        const cursosData = await cursosResponse.json();
        setCurso(cursosData); // Define os cursos recebidos da API

        // Se estamos editando uma aula, preencher os campos com os dados da aula
        if (aulaParaEditar) {
          setTitulo(aulaParaEditar.titulo);
          const [horas, minutos, segundos] = aulaParaEditar.duracao.split(':');
          setHoras(horas);
          setMinutos(minutos);
          setSegundos(segundos);
          setSelectedCurso(aulaParaEditar.idcurso);
          setTipo(aulaParaEditar.video ? 'video' : 'slide'); // Define o tipo baseado no que está editando
          
          // Carregar os anexo existentes
          if (aulaParaEditar.video) {
            setVideo(aulaParaEditar.video); // Se houver vídeo
          } else if (aulaParaEditar.slide) {
            setSlide(aulaParaEditar.slide); // Se houver slide
          }
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setErro('Erro ao carregar os cursos. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [aulaParaEditar]);

  const handleSelecionarCurso = (event) => {
    const selectedValue = event.target.value;
    setSelectedCurso(selectedValue);
    console.log('Curso selecionado:', selectedValue); // Debug
  };

  const handleTipoChange = (event) => {
    setTipo(event.target.value);
    setVideo(null);
    setSlide(null);
    console.log('Tipo selecionado:', event.target.value); // Debug
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideo(file);
    console.log('Vídeo selecionado:', file); // Debug
  };

  const handleSlideChange = (e) => {
    const file = e.target.files[0];
    setSlide(file);
    console.log('Slide selecionado:', file); // Debug
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validação dos campos obrigatórios
    if (!titulo || !horas || !minutos || !segundos || !tipo || !selectedCurso) {
      setErro('Todos os campos são obrigatórios.');
      return;
    }

    // Verifica se um anexo deve ser enviado
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('duracao', `${horas}:${minutos}:${segundos}`);
    formData.append('idcurso', selectedCurso);

    // Define o vídeo ou slide a ser enviado
    if (tipo === 'video') {
      if (video) {
        formData.append('video', video); // Adiciona novo vídeo se fornecido
      } else if (aulaParaEditar?.video) {
        formData.append('video', aulaParaEditar.video); // Mantém o vídeo existente
      }
    } else if (tipo === 'slide') {
      if (slide) {
        formData.append('slide', slide); // Adiciona novo slide se fornecido
      } else if (aulaParaEditar?.slide) {
        formData.append('slide', aulaParaEditar.slide); // Mantém o slide existente
      }
    }

    try {
      const url = aulaParaEditar ? `http://localhost:8000/api/aulas/${aulaParaEditar.idaula}/` : 'http://localhost:8000/api/aulas/';
      const method = aulaParaEditar ? 'PUT' : 'POST'; // Altera o método para PUT se estiver editando

      const response = await fetch(url, {
        method: method,
        body: formData,
      });

      if (response.ok) {
        resetForm(); 
        setMensagem(aulaParaEditar ? 'Aula atualizada com sucesso!' : 'Aula cadastrada com sucesso!');
      } else {
        setErro('Erro ao cadastrar a aula.');
      }
    } catch (error) {
      console.error('Erro ao cadastrar aula:', error);
      setErro('Erro na conexão com o servidor.');
    }
  };

  const resetForm = () => {
    setTitulo('');
    setHoras('');
    setMinutos('');
    setSegundos('');
    setTipo('');
    setVideo(null);
    setSlide(null);
    setSelectedCurso('');
    setErro('');
    setSucesso('');
    setMensagem('');
  };

  return (
    <div className="container">
      <NavbarPage />
      <h1>{aulaParaEditar ? 'Editar Aula' : 'Cadastro de Aula'}</h1>
      {isLoading ? (
        <p>Carregando cursos...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Título da aula"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />

          <h2>Curso</h2>
          <select
            name="cursos"
            value={selectedCurso}
            onChange={handleSelecionarCurso}
            required
          >
            <option value="" disabled>Selecione um curso</option>
            {curso.map((opcao) => (
              <option key={opcao.idcurso} value={opcao.idcurso}>
                {opcao.titulo}
              </option>
            ))}
          </select>

          {/* Campo de duração com precisão de horas, minutos e segundos */}
          <div className="duration-container">
            <label>Duração:</label>
            <input
              type="number"
              placeholder="Horas"
              value={horas}
              onChange={(e) => setHoras(e.target.value)}
              min="0"
            />
            <input
              type="number"
              placeholder="Minutos"
              value={minutos}
              onChange={(e) => setMinutos(e.target.value)}
              min="0"
              max="59"
            />
            <input
              type="number"
              placeholder="Segundos"
              value={segundos}
              onChange={(e) => setSegundos(e.target.value)}
              min="0"
              max="59"
            />
          </div>

          <div>
            <label>
              <input
                type="radio"
                value="video"
                checked={tipo === 'video'}
                onChange={handleTipoChange}
              />
              Vídeo
            </label>
            <label>
              <input
                type="radio"
                value="slide"
                checked={tipo === 'slide'}
                onChange={handleTipoChange}
              />
              Slide
            </label>
          </div>

          {tipo === 'video' && (
            <div>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange} // Atualizado
              />
              {aulaParaEditar && aulaParaEditar.video && (
                <p>Anexo atual: {aulaParaEditar.video}</p> // Mostra o vídeo atual
              )}
            </div>
          )}

          {tipo === 'slide' && (
            <div>
              <input
                type="file"
                accept=".pdf"
                onChange={handleSlideChange} // Atualizado
              />
              {aulaParaEditar && aulaParaEditar.slide && (
                <p>Anexo atual: {aulaParaEditar.slide}</p> // Mostra o slide atual
              )}
            </div>
          )}

          {erro && <p style={{ color: 'red' }}>{erro}</p>}
          {mensagem && <p style={{ color: 'green' }}>{mensagem}</p>}
          <button type="submit">{aulaParaEditar ? 'Atualizar' : 'Cadastrar'}</button>
        </form>
      )}
    </div>
  );
}

export default CadastroAula;
