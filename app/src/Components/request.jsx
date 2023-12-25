const baseUrl = 'http://localhost:8080'

export const auth = {
    login: `${baseUrl}/user/login`,
    google: `${baseUrl}/user/OAuth`,
    signup: `${baseUrl}/user/signup`,
    authenticate: `${baseUrl}/user/authenticate`,
    forgotPassword: `${baseUrl}/user/forgotPassword`
}