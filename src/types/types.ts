export interface UserInfo {
    username: string;
    password: string;
    email: string;
    documento: string;
    firstname: string;
    lastname: string;
    telefono: string;
}


export interface userLogin {
    email: string;
    password: string;
}

export interface forgotPassword {
    email: string;
}


export interface changePassword {
    password: string;
    code: string;
    email: string;
}

export interface validateCode {
    email: string;
    code: string;
}

export interface RentalInfo {
    id_usuario: number;
    id_vehiculo: number;
    fecha_inicio: Date;
    fecha_fin: Date;
    valor_total:string;
}

export interface AdminInfo {
    documento: string;
}

//? Tipos para los vehículos

export interface VehicleInfo {
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
    descripcion: string;
    valor_dia: number;
}

export interface vehicleSearchFilter {
    searchterm: string;
    filterattribute: string;
}

export interface getUser {
    id: string;
}

export interface updateUserInfo{
    username: string, 
    name: string,
    lastname: string,
    document: string, 
    phone: string, 
    email: string,
    userId: string
}

export interface getHistoryData {
    userId: string;
}

export interface handleDevolutionInfo {
    goodCondition: boolean;
    earlyReturn: boolean;
    earlyReturnReason: string;
    rating: number;
    rentalId: number;
}

export interface updateVehicleInfo {
    idvehiculo: number;
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
    descripcion: string;
    valor_dia: number;
}