import api from "./api"

export const loginUser = (credentials) => {
    return api.post("/login", credentials)
}

export const getAllUsers = () => {
    return api.get("/users")
}

export const promoteUser = (id) => {
    return api.patch(`/users/${id}`, { type: "admin" })
}
