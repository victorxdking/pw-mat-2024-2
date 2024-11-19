import React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { ptBR } from 'date-fns/locale/pt-BR'
import { parseISO } from 'date-fns'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import InputMask from 'react-input-mask'
import { feedbackWait, feedbackNotify, feedbackConfirm } from '../../ui/Feedback'
import { useNavigate, useParams } from 'react-router-dom'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

export default function CarsForm() {
  // Lista de cores disponíveis para o campo "Cor" no formulário
  const colors = [
    { value: 'AMARELO', label: 'AMARELO' },
    { value: 'AZUL', label: 'AZUL' },
    { value: 'BRANCO', label: 'BRANCO' },
    { value: 'CINZA', label: 'CINZA' },
    { value: 'DOURADO', label: 'DOURADO' },
    { value: 'LARANJA', label: 'LARANJA' },
    { value: 'MARROM', label: 'MARROM' },
    { value: 'PRATA', label: 'PRATA' },
    { value: 'PRETO', label: 'PRETO' },
    { value: 'ROSA', label: 'ROSA' },
    { value: 'ROXO', label: 'ROXO' },
    { value: 'VERDE', label: 'VERDE' },
    { value: 'VERMELHO', label: 'VERMELHO' },
  ]

  // Máscara para formatação de placas (ex.: ABC-1234)
  const plateMaskFormatChars = {
    9: '[0-9]', // Aceita apenas números
    $: '[0-9A-J]', // Aceita números de 0 a 9 e letras de A a J
    A: '[A-Z]', // Aceita letras maiúsculas de A a Z
  }

  // Cria uma lista de anos do ano atual até 1951
  const years = []
  for (let year = new Date().getFullYear(); year >= 1951; year--) {
    years.push(year)
  }

  // Valores padrão do formulário, usados para inicializar o estado do componente
  const formDefaults = {
    brand: '', // Marca do carro
    model: '', // Modelo do carro
    color: '', // Cor do carro
    year_manufacture: '', // Ano de fabricação
    imported: false, // Indica se o carro é importado
    plates: '', // Placa do carro
    selling_price: null, // Preço de venda 
    selling_date: null // Data de venda 
  }

  // Navegação e parâmetros da URL para gerenciar a edição ou criação
  const navigate = useNavigate()
  const params = useParams()

  // Estado que armazena os dados do formulário e se ele foi modificado
  const [state, setState] = React.useState({
    cars: { ...formDefaults },
    formModified: false
  })

  // Desestruturação para facilitar o acesso às variáveis do estado
  const { cars, formModified } = state

  // useEffect executa no carregamento inicial para verificar se é uma edição
  React.useEffect(() => {
    if (params.id) loadData() // Se há um ID nos parâmetros, carrega os dados do carro para edição
  }, [])

  // Função para buscar os dados do carro com base no ID da URL
  async function loadData() {
    feedbackWait(true) // Exibe um indicador de carregamento
    try {
      const response = await fetch(import.meta.env.VITE_API_BASE + '/cars/' + params.id)
      const result = await response.json()

      // Converte a data de venda para o formato utilizado no componente DatePicker
      if (result.selling_date) result.selling_date = parseISO(result.selling_date)

      // Atualiza o estado com os dados carregados
      setState({ ...state, cars: result, formModified: false })
    } catch (error) {
      console.log(error) // Log de erro para debug
      feedbackNotify('ERRO: ' + error.message, 'error') // Exibe uma mensagem de erro
    } finally {
      feedbackWait(false) // Remove o indicador de carregamento
    }
  }

  // Atualiza os campos do formulário conforme o usuário interage com eles
  function handleFieldChange(event) {
    const carsCopy = { ...cars } // Cria uma cópia dos dados do formulário
    carsCopy[event.target.name] = event.target.value // Atualiza o campo modificado
    setState({ ...state, cars: carsCopy, formModified: true }) // Atualiza o estado
  }

  // Salva os dados do formulário no servidor (criação ou edição)
  async function handleFormSubmit(event) {
    event.preventDefault() // Evita o comportamento padrão do formulário (recarregar a página)
    feedbackWait(true)
    try {
      const reqOptions = {
        method: 'POST', // Método padrão é POST (para criação)
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cars)
      }

      if (params.id) {
        // Se há um ID, significa que estamos editando, então o método deve ser PUT
        reqOptions.method = 'PUT'
        await fetch(import.meta.env.VITE_API_BASE + '/cars/' + params.id, reqOptions)
      } else {
        // Se não há ID, é um novo registro (POST)
        await fetch(import.meta.env.VITE_API_BASE + '/cars', reqOptions)
      }

      feedbackNotify('Item salvo com sucesso.', 'success', 4000, () => {
        navigate('..', { relative: 'path', replace: true }) // Redireciona para a lista
      })
    } catch (error) {
      console.log(error)
      feedbackNotify('ERRO: ' + error.message, 'error') // Exibe erro, se houver
    } finally {
      feedbackWait(false)
    }
  }

  // Confirma com o usuário antes de voltar à página anterior sem salvar alterações
  async function handleBackButtonClick() {
    if (formModified && !await feedbackConfirm('Há informações não salvas. Deseja realmente voltar?'))
      return // Cancela a ação, se o usuário optar por não voltar
    navigate('..', { relative: 'path', replace: true }) // Redireciona para a página anterior
  }

  return (
    <>
      {/* Título da página */}
      <Typography variant="h1" gutterBottom>
        {params.id ? `Editar carro #${params.id}` : 'Cadastrar novo carro'}
      </Typography>

      <Box className="form-fields">
        {/* Formulário de cadastro/edição de carro */}
        <form onSubmit={handleFormSubmit}>
          {/* Campo de entrada para a marca do carro */}
          <TextField
            variant="outlined"
            name="brand"
            label="Marca do carro"
            fullWidth
            required
            autoFocus
            value={cars.brand}
            onChange={handleFieldChange}
          />

          {/* Campo de entrada para o modelo do carro */}
          <TextField
            variant="outlined"
            name="model"
            label="Modelo do carro"
            fullWidth
            required
            value={cars.model}
            onChange={handleFieldChange}
          />

          {/* Menu dropdown para selecionar a cor do carro */}
          <TextField
            select
            variant="outlined"
            name="color"
            label="Cor"
            fullWidth
            required
            value={cars.color}
            onChange={handleFieldChange}
          >
            {/* Itera sobre as cores disponíveis e renderiza cada uma como uma opção */}
            {colors.map(s =>
              <MenuItem key={s.value} value={s.value}>
                {s.label}
              </MenuItem>
            )}
          </TextField>

          {/* Menu dropdown para selecionar o ano de fabricação */}
          <TextField
            select
            variant="outlined"
            name="year_manufacture"
            label="Ano de fabricação"
            fullWidth
            required
            value={cars.year_manufacture}
            onChange={handleFieldChange}
          >
            {/* Lista os anos disponíveis como opções */}
            {years.map(year =>
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            )}
          </TextField>

          {/* Checkbox para indicar se o carro é importado */}
          <div className="MuiFormControl-root">
            <FormControlLabel
              control={
                <Checkbox
                  name='imported'
                  checked={cars.imported}
                  onChange={(event) =>
                    setState({ ...state, cars: { ...cars, imported: event.target.checked }, formModified: true })
                  }
                />
              }
              label='Importado'
            />
          </div>

          {/* Campo para entrada da placa do carro com máscara de formato */}
          <InputMask
            mask='AAA-9$99'
            formatChars={plateMaskFormatChars}
            maskChar=' '
            value={cars.plates}
            onChange={handleFieldChange}
          >
            {() =>
              <TextField
                name="plates"
                label="Placa"
                variant="outlined"
                required
                fullWidth
              />
            }
          </InputMask>

          {/* Campo para selecionar a data de venda */}
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={ptBR}
          >
            <DatePicker
              label="Data de venda"
              value={cars.selling_date || null}
              slotProps={{
                textField: {
                  variant: 'outlined',
                  fullWidth: true
                }
              }}
              onChange={date => {
                const event = { target: { name: 'selling_date', value: date } }
                handleFieldChange(event)
              }}
            />
          </LocalizationProvider>

          {/* Campo de entrada para o preço de venda */}
          <TextField
            variant="outlined"
            name="selling_price"
            label="Preço de venda"
            fullWidth
            type='number'
            value={cars.selling_price}
            onChange={handleFieldChange}
          />

          {/* Botões de ação do formulário */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-around',
            width: '100%'
          }}>
            <Button
              variant="contained"
              color="secondary"
              type="submit"
            >
              Salvar
            </Button>
            <Button
              variant="outlined"
              onClick={handleBackButtonClick}
            >
              Voltar
            </Button>
          </Box>
        </form>
      </Box>
    </>
  )
}
