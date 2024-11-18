import { Repository } from "typeorm";
import { AppDataSource } from "../database/connection";
import { Vehicle } from "../entities/Vehicles";

export class VehicleService {

    private vehicleRepository: Repository<Vehicle>;

    constructor() {
        this.vehicleRepository = AppDataSource.getRepository(Vehicle);
    }

    public async getvehicles() {
        try {
            const avaVehicles = await this.vehicleRepository.find();

            const vehicles = avaVehicles.map(vehicle => ({
                idvehiculo: vehicle.idvehiculo,
                nombre: vehicle.nombre,
                matricula: vehicle.matricula,
                tipovehiculo: vehicle.tipovehiculo,
                modelo: vehicle.modelo,
                color: vehicle.color,
                cilindraje: vehicle.cilindraje,
                marca: vehicle.marca,
                capacidad: vehicle.capacidad,
                tipoCombustible: vehicle.tipoCombustible,
            }));

            return {
                vehicles
            }
        } catch (error) {
            console.log("Ocurrió un error al obtener los vehículos", error);
            return false;
        }
    }
}
