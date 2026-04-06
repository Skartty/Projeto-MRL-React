import "../styles/avaliacoes.css";

function Avaliacoes() {

  const avaliacoes = [
    {
      nome: "Marina Santos",
      comentario:
        "A MRL trouxe uma solução extremamente eficiente para nossa empresa. O sistema é rápido e intuitivo."
    },
    {
      nome: "Ricardo Almeida",
      comentario:
        "Excelente atendimento e desenvolvimento muito profissional. Automatizamos diversos processos."
    },
    {
      nome: "Fernanda Costa",
      comentario:
        "A plataforma melhorou nossa produtividade e reduziu muito o tempo das operações."
    },
    {
      nome: "Lucas Oliveira",
      comentario:
        "A equipe da MRL demonstrou muito profissionalismo durante todo o projeto."
    },
    {
      nome: "Camila Rocha",
      comentario:
        "O sistema desenvolvido trouxe organização e agilidade para nossa empresa."
    },
    {
      nome: "Eduardo Martins",
      comentario:
        "Interface moderna e fácil de utilizar. Nossa equipe se adaptou rapidamente."
    }
  ];

  return (
    <section id="avaliacoes" className="avaliacoes">

      <h2 className="titulo-avaliacoes">
        Nossas Avaliações
      </h2>

      <div className="carrossel-avaliacoes">

        <div className="cards-avaliacoes">

          {[...avaliacoes, ...avaliacoes].map((avaliacao, index) => (
            <div className="card-avaliacao" key={index}>

              <h3 className="cliente">
                {avaliacao.nome}
              </h3>

              <div className="estrelas">
                ★★★★★
              </div>

              <p className="comentario">
                {avaliacao.comentario}
              </p>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}

export default Avaliacoes;