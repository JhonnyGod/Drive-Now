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


//Lo que necesitas es enviarme la solicitud al servicio sendEmail de la instancia userService