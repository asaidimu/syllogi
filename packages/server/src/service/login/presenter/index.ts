function LoginPresenter(route: Route<LoginController>) {
    const { router, validate, controller, auth } = route;

    router.post("/authenticate", validate, async (req, res) => {
        const { username, password } = req.body;

        const credentialsError  = () => {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const createSession = async (login: LoginCredentials)  => {
            const token = await auth.generateAuthToken(login);

            res.status(201).cookie("auth_token", token, {
                httpOnly: true,
                secure: true,
            });

            return res.json({ token });
        }

        const login = await controller.findLoginCredentials({
            username,
        });

        if (login === null) {
            return credentialsError()
        }

        if(!auth.verifyPassword({ password, hash: login.password })) {
            return credentialsError()
        }

        return createSession(login)

    });
}

export default LoginPresenter;
