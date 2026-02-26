import api from "./api"

export const getAllConferences = () => {
    return api.get("/conferences")
}

export const getConferenceById = (id) => {
    return api.get(`/conferences/${id}`)
}