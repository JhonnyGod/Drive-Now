import { ILike, Repository } from "typeorm";
import { AppDataSource } from "../database/connection";
import { Vehicle } from "../entities/Vehicles";
import { User } from "../entities/User";
import { VehicleInfo, vehicleSearchFilter } from "../types/types";
import { Person } from "../entities/Persons";
import { Invoice } from "../entities/Invoice";
import { Rental } from "../entities/Rental";
const nodemailer = require("nodemailer");

export class VehicleService {

    private vehicleRepository: Repository<Vehicle>;
    private userRepository: Repository<User>;
    private personRepository: Repository<Person>;
    private invoiceRepository: Repository<Invoice>;
    private rentalRepository: Repository<Rental>;

    constructor() {
        this.vehicleRepository = AppDataSource.getRepository(Vehicle);
        this.userRepository = AppDataSource.getRepository(User);
        this.personRepository = AppDataSource.getRepository(Person);
        this.invoiceRepository = AppDataSource.getRepository(Invoice);
        this.rentalRepository = AppDataSource.getRepository(Rental);
    }

    public async getvehicles() {
        try {
            const avaVehicles = await this.vehicleRepository.find({where: {disponible: true}});

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
                tipoCombustible: vehicle.combustible,
                image_src: vehicle.image_src,
                descripcion: vehicle.descripcion,
                valor_dia: vehicle.valor_dia
            }));

            return {
                vehicles
            }
        } catch (error) {
            console.log("Ocurrió un error al obtener los vehículos", error);
            return false;
        }
    }

    public async rentvehicle(RentalInfo: any) {
        try {
            const user = await this.userRepository.findOneBy({ id: RentalInfo.id_usuario });
            if (!user) {
                return { ok: false, message: 'User not found' }
            }

            const vehicle = await this.vehicleRepository.findOneBy({ idvehiculo: RentalInfo.id_vehiculo });
            if (!vehicle) {
                return { ok: false, message: 'Vehicle not found' }
            }

            await this.vehicleRepository.update({ idvehiculo: RentalInfo.id_vehiculo }, { disponible: false });
        
            const person = await this.personRepository.findOne({
                where: { user: { id: user.id } },
                relations: ['user'],  
            });

            if (!person) {
                return { ok: false, message: 'Person not found' }
            }

            const document = person.documento;

            const fecha_inicio = RentalInfo.fecha_inicio;
            const fecha_fin = RentalInfo.fecha_fin;

            const newRental = await this.rentalRepository.save({
                fecha_inicio: fecha_inicio,
                fecha_fin: fecha_fin,
                fecha_devolucion: fecha_fin,
                estado: true,
                idcliente: { documento: document },
                idvehiculo: { idvehiculo: RentalInfo.id_vehiculo },
            });
            
            if (!newRental) {
                return { ok: false, message: 'Error while renting vehicle' };
            }
            
            // Asociar Rental al Invoice
            const invoice = await this.invoiceRepository.save({
                fecha: new Date(),
                valor_total: RentalInfo.valor_total,
                alquiler: newRental, 
            });
            
            if (!invoice) {
                return { ok: false, message: 'Error while creating invoice' };
            }
            
            return { ok: true, message: 'Vehicle rented successfully' };

        } catch (error) {
            console.log("Ocurrió un error al rentar el vehículo", error);
            return false;
            
        }
        
    }

    public async addvehicle(VehicleInfo: VehicleInfo) {
        const newVehicleJson = {
            nombre: VehicleInfo.nombre,
            matricula: VehicleInfo.matricula,
            tipovehiculo: VehicleInfo.tipovehiculo,
            modelo: VehicleInfo.modelo,
            color: VehicleInfo.color,
            cilindraje: VehicleInfo.cilindraje,
            marca: VehicleInfo.marca,
            capacidad: VehicleInfo.capacidad,
            combustible: VehicleInfo.combustible,
            image_src: VehicleInfo.image_src,
            disponible: true,
        }

        try {
            const existingVehicle = await this.vehicleRepository.findOneBy({ matricula: VehicleInfo.matricula});
            if (existingVehicle) {
                return { ok: false, message: 'Vehicle already exists' }
            }

            const newVehicle = await this.vehicleRepository.save(newVehicleJson);
            return newVehicle;

        } catch (error) {
            console.log("Ocurrió un error al agregar el vehículo", error);
            return false;
        }
    }

    public async fuzzySearchVehicles(searchFilters: vehicleSearchFilter): Promise<Vehicle[]> {

        const filterAttribute = searchFilters.filterattribute;
        const searchTerm = searchFilters.searchterm;

        const validAttributes = ['nombre', 'capacidad', 'tipovehiculo', 'modelo', 'color', 'cilindraje', 'marca', 'combustible']; 
    
        if (!validAttributes.includes(filterAttribute)) {
            throw new Error('Atributo no válido para la búsqueda');
        }

        try {
            const vehicles = await this.vehicleRepository
                .createQueryBuilder('vehicle')
                .where(`SIMILARITY(vehicle.${filterAttribute}, :searchTerm) > 0.1`, { searchTerm })
                .orderBy(`SIMILARITY(vehicle.${filterAttribute}, :searchTerm)`, 'DESC')
                .setParameter('searchTerm', searchTerm)
                .getMany();
    
            return vehicles;
        } catch (error) {
            console.error('Error en búsqueda difusa:', error);
            throw new Error('Error al realizar la búsqueda difusa');
        }
    }
}
