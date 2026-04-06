import IconUsuario from "../assets/Admin/Icon_Usuario.png";
import IconCalendario from "../assets/Admin/Icon_Calendario.png";
import IconTempo from "../assets/Admin/Icon_Tempo.png";

export default function Card({ cor }) {
  return (
    <div className="admin-card">

      <div className="admin-card-header" style={{ background: cor }}>
        Desenvolvimento Web
      </div>

      <div className="admin-card-body">

        <div className="info">
          <img src={IconUsuario} alt="" />
          <span>Isabella Braga</span>
        </div>

        <div className="linha"></div>

        <div className="info">
          <img src={IconCalendario} alt="" />
          <span>03/03/2026</span>
        </div>

        <div className="linha"></div>

        <div className="info">
          <img src={IconTempo} alt="" />
          <span>03/06/2026</span>
        </div>

      </div>

      <div className="admin-card-btn" style={{ background: cor }}>
        +
      </div>

    </div>
  );
}