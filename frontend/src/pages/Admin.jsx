import Sidebar from "../components/Sidebar";
import Kanban from "../components/Kanban";
import "../styles/admin.css";

export default function Admin() {
  return (
    <div className="admin">
      <Sidebar />
      <Kanban />
    </div>
  );
}