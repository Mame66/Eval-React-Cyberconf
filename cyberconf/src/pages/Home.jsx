import { useEffect, useState } from "react"
import { getAllConferences } from "../services/conferenceService"
import ConferenceCard from "../components/conference/ConferenceCard"

function Home() {
    const [conferences, setConferences] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getAllConferences()
            .then((res) => {
                setConferences(res.data)
                setLoading(false)
            })
            .catch((err) => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    if (loading) return <p>Chargement...</p>

    return (
        <div>
            <h1>Liste des conférences</h1>

            {conferences.map((conf) => (
                <ConferenceCard
                    key={conf.id}
                    conference={conf}
                />
            ))}
        </div>
    )
}

export default Home