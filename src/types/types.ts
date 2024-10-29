export interface UserInfo{
    username: string;
    password: string;
    email: string;
    documento: string;
    firstname: string;
    lastname: string;
    telefono: string;
}


export interface userLogin{
    username: string;
    password: string;
}

export interface forgotPassword{
    email: string;
}


export interface changePassword{
    password: string;
    code: string;
}