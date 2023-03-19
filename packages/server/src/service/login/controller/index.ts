const loginController: Controller<LoginController> = () => {
    return {
        createLogin() {
            return Promise.resolve(1)
        },
        checkLoginPassword(/* { id, hash } */) {
            return Promise.resolve(true)
        }
    }
}

export default loginController
