import { Link } from "react-router"

export default function PageDashboardHome() {
  return (
    // TODO: Agregar el componente de la lista de iniciativas
    <div>
      <h1>Temporal se va a eliminar</h1>
      <nav>
        <ul className="flex gap-2">
          <li className="bg-primary text-white rounded-md hover:bg-primary/90">
            <Link className="text-sm block p-2" to="/comments">
              Ir a Comments
            </Link>
          </li>
          <li className="bg-primary text-white rounded-md hover:bg-primary/90">
            <Link className="text-sm block p-2" to="/votes">
              Ir a Votes
            </Link>
          </li>
          <li className="bg-primary text-white rounded-md hover:bg-primary/90">
            <Link className="text-sm block p-2" to="/proposal">
              Ir a Proposal
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
