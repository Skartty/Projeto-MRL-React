import Card from "./Card";

export default function Coluna({ titulo, cor, ultima }) {
  return (
    <div className="admin-coluna">

      <div className="admin-coluna-header">
        {titulo}
      </div>

      {!ultima && <div className="admin-linha"></div>}

      <div className="admin-cards">
        <Card cor={cor} />
      </div>

    </div>
  );
}