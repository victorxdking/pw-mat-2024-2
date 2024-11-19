import Typography from '@mui/material/Typography';
import * as React from 'react';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import { feedbackWait, feedbackNotify, feedbackConfirm } from '../../ui/Feedback';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';

export default function CarsList() {
  // Define as colunas da tabela (DataGrid)
  const columns = [
    {
      field: 'id', // Nome do campo no objeto de dados
      headerName: 'Cód.', // Nome exibido no cabeçalho da coluna
      width: 90, // Largura da coluna
    },
    {
      field: 'brand',
      headerName: 'Marca/Modelo',
      width: 200,
      // Combina marca e modelo em uma célula para exibição
      renderCell: (params) => `${params.row.brand} / ${params.row.model}`,
    },
    {
      field: 'color',
      headerName: 'Cor do Carro',
      width: 200, // Exibe a cor do carro
    },
    {
      field: 'year_manufacture',
      headerName: 'Ano de fabricação',
      width: 200, // Ano de fabricação do carro
    },
    {
      field: 'imported',
      headerName: 'Importado?',
      width: 200,
      // Exibe "SIM" se o carro for importado caso contrário, exibe vazio
      renderCell: (params) => (params.row.imported ? 'SIM' : ''),
    },
    {
      field: 'plates',
      headerName: 'Placa',
      width: 200, // Exibe o número da placa do carro
    },
    {
      field: 'selling_date',
      headerName: 'Data de venda',
      width: 200,
      // Formata a data para o padrão brasileiro (dd/mm/aaaa)
      valueFormatter: (value) =>
        value ? new Date(value).toLocaleDateString('pt-BR') : '',
    },
    {
      field: 'selling_price',
      headerName: 'Preço de venda',
      width: 200,
      // Formata o preço para o padrão brasileiro (ex: R$ 10.000,00)
      renderCell: (params) =>
        params.row.selling_price?.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
    },
    {
      field: '_actions',
      headerName: 'Ações',
      width: 150,
      sortable: false, // Coluna de ações não é ordenável
      renderCell: (params) => (
        <>
          {/* Link para a página de edição do carro */}
          <Link to={'./' + params.id}>
            <IconButton aria-label="editar">
              <EditIcon />
            </IconButton>
          </Link>

          {/* Botão para excluir o carro */}
          <IconButton
            aria-label="excluir"
            onClick={() => handleDeleteButtonClick(params.id)}
          >
            <DeleteForeverIcon color="error" />
          </IconButton>
        </>
      ),
    },
  ];

  // Estado inicial do componente, que armazena a lista de carros
  const [state, setState] = React.useState({
    cars: [], // Inicialmente vazio
  });

  const { cars } = state; // Desestruturação para acessar a lista de carros

  // useEffect executa ao montar o componente, chama a função para carregar os dados
  React.useEffect(() => {
    loadData();
  }, []); // Vetor de dependências vazio, executa apenas uma vez

  // Função para buscar a lista de carros da API
  async function loadData() {
    feedbackWait(true); // Exibe indicador de carregamento
    try {
      const response = await fetch(import.meta.env.VITE_API_BASE + '/cars'); // Faz a requisição à API
      const result = await response.json(); // Converte a resposta para JSON
      setState({ ...state, cars: result }); // Atualiza o estado com os dados recebidos
    } catch (error) {
      console.error(error); // Log do erro para debug
      feedbackNotify('Erro ao carregar dados: ' + error.message, 'error'); // Notifica o erro
    } finally {
      feedbackWait(false); // Remove o indicador de carregamento
    }
  }

  // Função para excluir um carro
  async function handleDeleteButtonClick(id) {
    // Solicita confirmação do usuário antes de excluir
    if (await feedbackConfirm('Deseja realmente excluir este item?')) {
      feedbackWait(true); // Exibe indicador de carregamento
      try {
        // Faz a requisição de exclusão à API
        await fetch(import.meta.env.VITE_API_BASE + `/cars/${id}`, {
          method: 'DELETE',
        });
        loadData(); // Recarrega os dados após exclusão
        feedbackNotify('Carro excluído com sucesso.'); // Notifica sucesso
      } catch (error) {
        console.error(error); // Log do erro
        feedbackNotify('Erro ao excluir: ' + error.message, 'error'); // Notifica erro
      } finally {
        feedbackWait(false); // Remove indicador de carregamento
      }
    }
  }

  return (
    <>
      {/* Título da página */}
      <Typography variant="h1" gutterBottom>
        Listagem de carros
      </Typography>

      {/* Botão para adicionar um novo carro */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'right', // Alinha o botão à direita
          mb: 2, // Margem inferior
        }}
      >
        <Link to="./new">
          <Button
            variant="contained"
            size="large"
            color="secondary"
            startIcon={<AddCircleIcon />}
          >
            Novo carro
          </Button>
        </Link>
      </Box>

      {/* Tabela que exibe a lista de carros */}
      <Paper elevation={8} sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={cars} // Dados a serem exibidos na tabela
          columns={columns} // Estrutura das colunas
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5, // Tamanho da página inicial
              },
            },
          }}
          pageSizeOptions={[5]} // Opções de tamanho de página
          checkboxSelection // Permite seleção de linhas com checkboxes
          disableRowSelectionOnClick // Evita seleção ao clicar na linha
        />
      </Paper>
    </>
  );
}
