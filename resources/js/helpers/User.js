import AppStorage from './AppStorage'

class User {
    login(data) {
        return axios.post('/api/login', data, {
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
            }
        })
    }
    
    signupCustomer(data) {
        return axios.post('/api/register/customer', data, {
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
            }
        })
    }

    signupSeller(data) {
        return axios.post('/api/register/seller', data, {
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
            }
        })
    }

    storeSession(data) {
        const user = JSON.stringify(data.user);
        const token = data.token;
        AppStorage.store(user, token);
        if(data.user.role_id === 2) {
            const stand = JSON.stringify(data.user.stands);
            AppStorage.storeStand(stand);
        }
    }

    loggedIn() {
        const storedToken = AppStorage.getToken();
        if(!!storedToken) {
            return true;
        } else {
            return false;
        }
    }

    getToken() {
        const storedToken = AppStorage.getToken();
        return storedToken;
    }

    logout() {
        return new Promise(resolve => {
            setTimeout(() => {
                AppStorage.clear();
                resolve();
            }, 300);
        })
    }

    info() {
        if(this.loggedIn) {
            return AppStorage.getUser();
        }
        return console.log("please login first");
    }

    getStand() {
        if(this.loggedIn) {
            return AppStorage.getStand();
        }
        return console.log("please login first");
    }

    getInfo() {
        return new Promise((resolve, reject) => {
            const id = (this.info() || {}).id
            if(!!id) {
                axios.get(`/api/users/${id}`).then(res => {
                    AppStorage.storeUser(JSON.stringify(res.data))
                    resolve(res.data);
                }).catch(err => {
                    this.logout()
                    reject(err);
                })
            } else {
                this.logout()
                reject(err);
            }
        })
    }

    updateInfo() {
        return new Promise((resolve, reject) => {
            if(this.loggedIn) {
                axios.post('/api/auth/me', {
                    token: AppStorage.getToken()
                }, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-type': 'application/json'
                    }
                }).then(res => {
                    if (res.data.auth) {
                        AppStorage.storeUser(JSON.stringify(res.data.user));
                        resolve("update success");
                    } else {
                        reject("User update went wrong");
                    }
                }).catch(err => {
                    reject(err);
                })
            } else {
                reject("notloggedin");
            }
        })
    }
    
}

export default User = new User();