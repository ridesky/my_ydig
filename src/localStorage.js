var STORAGE_KEY = "user_localstorage";
// var userStorage = 
export default {
    save(userInfo) {
        localStorage.setItem(STORAGE_KEY,JSON.stringify(userInfo));
    },
    fetch(){
        var userInfo = JSON.parse(localStorage.getItem(STORAGE_KEY)||'{"username":""}');
        return userInfo;
    }
}