import { Validator } from "@syllogi/model"

const validator = {
    "POST:/authenticate": Validator.LoginCredentials
}

export default validator
