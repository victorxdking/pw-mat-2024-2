import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import foto from '../assets/victor_vieira.jpg';

export default function About() {
  /* 
    Declara um estado chamado 'likes' que armazenará o número de curtidas
    O estado é inicializado com o valor do 'localStorage' usando o lazy initializer
    Se não houver valor armazenado no 'localStorage', será inicializado com 0
  */
  const [likes, setLikes] = React.useState(
    () => Number(window.localStorage.getItem('likes')) || 0
  );

  /* 
    Hook useEffect que sincroniza o estado 'likes' com o 'localStorage'
    Sempre que o valor de 'likes' for alterado, ele será atualizado no 'localStorage'
  */
  React.useEffect(() => {
    window.localStorage.setItem('likes', likes);
  }, [likes]);      // O array de dependências contém 'likesN', garantindo que o efeito seja executado quando 'likes' mudar

  return (
    <>
      {/* 
        Componente Typography usado para exibir o título "Sobre o autor"
        O prop 'variant="h1"' define que o título será exibido com estilo de cabeçalho nível 1
        O prop 'gutterBottom' adiciona um espaçamento na parte inferior do título
      */}
      <Typography variant="h1" gutterBottom>
        Sobre o autor
      </Typography>

      {/* 
        Componente Card usado para estruturar o cartão.
        O prop 'sx={{ maxWidth: 300 }}' define o estilo do cartão, limitando sua largura a 300 pixels
      */}
      <Card sx={{ maxWidth: 300 }}>
        {/* 
          Componente CardMedia usado para exibir a imagem no cartão
          O prop 'sx={{ height: 300 }}' ajusta a altura da imagem
          O prop 'image={foto}' define a imagem que será exibida (a foto importada)
          O prop 'title="selfie"' é usado para acessibilidade, descrevendo a imagem
        */}
        <CardMedia
          sx={{ height: 300 }}
          image={foto}
          title="selfie"
        />

        {/* 
          Componente CardContent usado para exibir o conteúdo textual do cartão, 
          como o nome e a descrição
        */}
        <CardContent>
          {/* 
            Typography usado para exibir o nome do autor
            O prop 'variant="h5"' define o estilo como título de nível 5
            O prop 'component="div"' define que o conteúdo será renderizado em uma tag <div>
          */}
          <Typography gutterBottom variant="h5" component="div">
            Victor Vieira
          </Typography>

          {/* 
            Typography usado para exibir um pequeno texto sobre o autor
            O prop 'variant="body2"' aplica o estilo de texto secundário
            O prop 'color="text.secondary"' altera a cor do texto para um tom mais claro
          */}
          <Typography variant="body2" color="text.secondary">
            Atualmente, sou estudante do curso de Análise e Desenvolvimento de Sistemas na Fatec Franca. Após 6 meses de estágio na Compass UOL, 
            fui efetivado e estou prestes a iniciar minha trajetória profissional na área de TI, com foco em Engenharia de Dados. 
            No meu tempo livre, gosto de me dedicar a atividades físicas, especialmente academia.
          </Typography>
        </CardContent>

        {/* 
          Componente CardActions usado para exibir ações relacionadas ao cartão
          Aqui contém um único botão que incrementa o número de curtidas ao ser clicado
        */}
        <CardActions>
          {/* 
            Componente Button usado para criar o botão de curtida
            O prop 'variant="contained"' aplica o estilo de botão preenchido
            O prop 'color="secondary"' define a cor do botão como secundária
            O prop 'startIcon={<FavoriteIcon />}' adiciona o ícone de favorito antes do texto
            O prop 'onClick={() => setLikes(likes + 1)}' define a função chamada ao clicar no botão, incrementando o estado 'likes' em 1
          */}
          <Button 
            variant="contained" 
            color="secondary" 
            startIcon={<FavoriteIcon />}
            onClick={() => setLikes(likes + 1)}
          >
            Curtir ({likes}) {/* Exibe o número atual de curtidas entre parênteses */}
          </Button>
        </CardActions>
      </Card>
    </>
  );
}
