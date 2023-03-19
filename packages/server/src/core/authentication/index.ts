import { decodeAuthToken, allow } from "./middleware.js";
import {
    generateAuthToken,
    validateAuthToken,
    hashPassword,
    verifyPassword,
} from "./services.js";


const authentication = {
    generateAuthToken,
    validateAuthToken,
    hashPassword,
    verifyPassword,
    decodeAuthToken,
    allow,
};

declare global {
    type Authentication = typeof authentication;
}

export default authentication;
