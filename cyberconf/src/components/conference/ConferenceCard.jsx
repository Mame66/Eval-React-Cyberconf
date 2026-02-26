import { Link } from "react-router-dom"
import "./ConferenceCard.css"

function ConferenceCard({ conference }) {
    return (
        <div
            className="conference-card"
            style={{
                borderLeft: `8px solid ${conference.design.mainColor}`
            }}
        >
            <img src={conference.img} alt={conference.title} />

            <h2>{conference.title}</h2>
            <p>{conference.date}</p>
            <p>{conference.description}</p>

            <Link to={`/conference/${conference.id}`}>
                Voir détails
            </Link>
        </div>
    )
}

export default ConferenceCard