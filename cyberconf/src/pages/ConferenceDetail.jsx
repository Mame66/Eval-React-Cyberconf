import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getConferenceById } from "../services/conferenceService"

function ConferenceDetail() {
    const { id } = useParams()
    const [conference, setConference] = useState(null)

    useEffect(() => {
        getConferenceById(id)
            .then((res) => {
                setConference(res.data)
            })
            .catch((err) => {
                console.error(err)
            })
    }, [id])

    if (!conference) return <p>Chargement...</p>

    return (
        <div
            style={{
                backgroundColor: conference.design.mainColor,
                color: "white",
                padding: "40px",
                minHeight: "100vh"
            }}
        >
            <h1>{conference.title}</h1>
            <p>{conference.date}</p>
            <img
                src={conference.img}
                alt={conference.title}
                style={{ width: "100%", maxWidth: "600px" }}
            />

            <p>{conference.content}</p>
            <p>Durée : {conference.duration}</p>

            <h3>Speakers</h3>
            <ul>
                {conference.speakers.map((speaker, index) => (
                    <li key={index}>
                        {speaker.firstname} {speaker.lastname}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ConferenceDetail