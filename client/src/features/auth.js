import conf from '../conf/conf.js';
import axios from 'axios';

export class AuthService {
    constructor() {
        this.client = axios.create({
            baseURL: conf.appwriteUrl,
            // baseURL: "https://pandas-server.onrender.com/api/v1",
            withCredentials: true
        });

        // Interceptor to attach the token to each request
        this.client.interceptors.request.use(config => {
            const token = localStorage.getItem('accessToken');
            if (token && config.url !== '/users/login') {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        }, error => {
            return Promise.reject(error);
        });



    }

    async createAccount({ ...data }) {
        try {

            const response = await this.client.post('/users/register', data);

            // console.log("Response received:", response.data);  // Log the response

            if (response.data && response.data) {
                return response.data.message;
                // return this.login({ userName, password });
            } else {
                console.error("Account creation failed:", response.data, response.status, response.statusText);
                return null;
            }
        } catch (error) {
            console.error("Error in createAccount:", error.response.data);
            // return error
            throw error;
        }
    }

    async registerBusiness({ ...data }) {
        try {

            // console.log("auth data: ", data);

            const response = await this.client.post('/users/register-business', data);

            // console.log("Response received:", response.data);  // Log the response

            if (response.data && response.data) {
                return response.data.message;
                // return this.login({ userName, password });
            } else {
                console.error("Business creation failed:", response.data, response.status, response.statusText);
                return null;
            }
        } catch (error) {
            console.error("Error in register Business:", error.response.data);
            // return error
            throw error;
        }
    }

    async registerRole({ ...data }) {
        try {

            // console.log("auth data: ", data);

            const response = await this.client.post('/users/register-role', data);

            // console.log("Response received:", response.data);  // Log the response

            if (response.data && response.data) {
                return response.data.message;
            } else {
                console.error("Business role creation failed:", response.data, response.status, response.statusText);
                return null;
            }
        } catch (error) {
            console.error("Error in register Role:", error.response.data);
            throw error;
        }
    }

    async getRoles() {
        const token = localStorage.getItem('accessToken');
        try {
            const response = await this.client.get('/users/get-roles',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

            if (response.data) {
                const data = response.data
                return data;
            }

        } catch (error) {
            console.error("Error in get roles:", error);
            throw error;

        }
    }


    async login({ ...data }) {
        try {
            // console.log("data in auth: ", JSON.stringify(data) )
            const response = await this.client.post('/users/login',
                data
            );
            // console.log("response: ",JSON.stringify( response.data.data.user));

            if (response.data) {
                console.log(response.data)
                const accessToken = response.data.data.accessToken;
                const refreshToken = response.data.data.refreshToken;
                this.saveAccessToken(accessToken);
                this.saveRefreshToken(refreshToken);
                // this.startTokenRefreshTimer();
                return response.data.data;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error in login:", error);
            throw error;
        }
    }
    async forgotPassword({ ...data }) {
        try {
            // console.log("data in auth: ", JSON.stringify(data) )
            const response = await this.client.post('/users/change-password',
                data
            );

            if (response.data) {
                // console.log("response in auth: ", response.data)
                return response.data;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error in forgot password:", error);
            throw error;
        }
    }

    saveAccessToken(token) {
        localStorage.setItem('accessToken', token);
    }
    saveRefreshToken(token) {
        localStorage.setItem('refreshToken', token);
    }

    getAccessToken() {
        return localStorage.getItem('accessToken');
    }
    getRefreshToken() {
        return localStorage.getItem('refreshToken');
    }

    async logout() {
        try {
            const response = await this.client.post('/users/logout', null, {
                headers: {
                    'Authorization': `Bearer ${this.getAccessToken()}`
                }
            });
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            return response.data;
        } catch (error) {
            console.log("Error in logout:", error);
        }
    }

    async refreshToken() {
        try {
            const refreshToken = this.getRefreshToken()
            const response = await this.client.post('/users/refresh-token', {
                refreshToken: refreshToken
            }, {
                headers: {
                    Authorization: ` Bearer ${this.getRefreshToken()}`,
                },
                withCredentials: true
            });
            console.log('refreshed token: ', response)
            const accessToken = response.data.data.accessToken;
            const RefreshToken = response.data.data.refreshToken;
            this.saveAccessToken(accessToken);
            this.saveRefreshToken(RefreshToken);
        } catch (error) {
            console.log("Error in refreshing token:", error);

        }


    }

    startTokenRefreshTimer() {
        if (this.tokenRefreshInterval) {
            clearInterval(this.tokenRefreshInterval);
        }

        this.tokenRefreshInterval = setInterval(() => {
            this.refreshToken();
        }, 5000);
    }

    async getCurrentUser() {
        try {
            const response = await this.client.get('/users/current-user', {
                headers: {
                    'Authorization': `Bearer ${this.getAccessToken()}`
                }
            });
            return response.data;
        } catch (error) {
            console.log("Error in get current user:", error);
            return null;
        }
    }

    async updateBusinessDetails(formData) {
        try {
            console.log("data in auth: ", formData)
            const response = await this.client.patch('/users/update-business-details',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${this.getAccessToken()}`,
                    }
                }
            );

            if (response.data) {
                console.log("response in auth: ", response.data)
                return response.data;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error in update business details:", error);
            throw error;
        }
    }

    async getBusinessDetails() {
        try {
            const response = await this.client.get('/users/get-business-details', {
                headers: {
                    'Authorization': `Bearer ${this.getAccessToken()}`
                }
            });
            return response.data;
        } catch (error) {
            console.log("Error in get business details:", error);
            return null;
        }
    }

    async updateUserDetails(formData) {
        try {
            // console.log("data in auth: ", formData )
            const response = await this.client.patch('/users/update-user-details',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${this.getAccessToken()}`,
                    }
                }
            );

            if (response.data) {
                console.log("response in auth: ", response.data)
                return response.data;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error in update user details:", error);
            throw error;
        }
    }

    async addNewUser(data) {
        try {
            const response = await this.client.post('/users/add-new-user',
                data,
                {
                    headers: {
                        'Authorization': `Bearer ${this.getAccessToken()}`
                    }
                });
            return response.data;
        } catch (error) {
            console.log("Error in adding new user:", error);
            throw error;
        }
    }

    async getBusinessUsers() {
        try {
            const response = await this.client.get('/users/get-all-users', {
                headers: {
                    'Authorization': `Bearer ${this.getAccessToken()}`
                }
            });
            return response.data;
        } catch (error) {
            console.log("Error in get all users:", error);
            throw error;
        }
    }

    async deleteUser(userId) {
        try {
            const response = await this.client.delete(`/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${this.getAccessToken()}`
                }
            });
            return response.data;
        } catch (error) {
            console.log("Error in deleting user:", error);
            throw error;
        }
    }

    async updateUser(userId, userData) {
        try {
            const response = await this.client.patch(`/users/${userId}`,
                userData,
                {
                    headers: {
                        'Authorization': `Bearer ${this.getAccessToken()}`
                    }
                });
            return response.data;
        } catch (error) {
            console.log("Error in updating user:", error);
            throw error;
        }
    }

    async assignUserRights(userId, roleIds) {
        try {
            const response = await this.client.patch(`/users/${userId}/rights`,
                { businessRoleIds: roleIds },
                {
                    headers: {
                        'Authorization': `Bearer ${this.getAccessToken()}`
                    }
                });
            return response.data;
        } catch (error) {
            console.log("Error in assigning user rights:", error);
            throw error;
        }
    }

}



const authService = new AuthService();

export default authService;


