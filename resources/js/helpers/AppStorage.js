class AppStorage
{
    storeToken(token) {
        localStorage.setItem('bazaar-pl-token', token);
    }
    storeUser(user) {
        localStorage.setItem('bazaar-pl-user', user);
    }
    storeStand(stand) {
        localStorage.setItem('bazaar-pl-stand', stand);
    }

    store(user,token) {
        this.storeToken(token);
        this.storeUser(user);
    }

    clear() {
        localStorage.removeItem('bazaar-pl-token');
        localStorage.removeItem('bazaar-pl-user');
        localStorage.removeItem('bazaar-pl-cart');
        localStorage.removeItem('bazaar-pl-stand');
    }

    getToken() {
        return localStorage.getItem('bazaar-pl-token');
    }
    getUser() {
        let user = localStorage.getItem('bazaar-pl-user');
        try {
            return JSON.parse(user);
        } catch (error) {
            return {}
        }
    }
    getStand() {
        let stand = localStorage.getItem('bazaar-pl-stand');
        try {
            return JSON.parse(stand);
        } catch (error) {
            return {}
        }
    }
}
export default AppStorage = new AppStorage();