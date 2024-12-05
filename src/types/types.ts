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
    email: string;
    password: string;
}

export interface forgotPassword{
    email: string;
}


export interface changePassword{
    password: string;
    code: string;
    email: string;
}

export interface validateCode{
    email: string;
    code: string;
}

export interface RentalInfo{
    idvehiculo: number;
    idpersona: number;
}

export interface AdminInfo{
    documento: string;
}

//? Tipos para los vehículos

export interface VehicleInfo{
    nombre: string;
    matricula: string;
    tipovehiculo: string;
    modelo: string;
    color: string;
    cilindraje: number;
    marca: string;
    capacidad: string;
    combustible: string;
    image_src: string;
}

export interface vehicleSearchFilter{
    searchterm: string;
    filterattribute: string;
}