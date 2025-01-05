export interface UserRegisterRequestInterface {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
}


export interface UserEditRequestInterface extends UserRegisterRequestInterface {
    oldUsername: string;
}
