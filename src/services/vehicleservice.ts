import { ILike, Repository } from "typeorm";
import { AppDataSource } from "../database/connection";
import { Vehicle } from "../entities/Vehicles";
import { User } from "../entities/User";
import { handleDevolutionInfo, VehicleInfo, vehicleSearchFilter } from "../types/types";
import { Person } from "../entities/Persons";
import { Invoice } from "../entities/Invoice";
import { Rental } from "../entities/Rental";
import { describe } from "node:test";
import { Return } from "../entities/Return";
const nodemailer = require("nodemailer");

export class VehicleService {

    private vehicleRepository: Repository<Vehicle>;
    private userRepository: Repository<User>;
    private personRepository: Repository<Person>;
    private invoiceRepository: Repository<Invoice>;
    private rentalRepository: Repository<Rental>;
    private returnRepository: Repository<Return>;

    constructor() {
        this.vehicleRepository = AppDataSource.getRepository(Vehicle);
        this.userRepository = AppDataSource.getRepository(User);
        this.personRepository = AppDataSource.getRepository(Person);
        this.invoiceRepository = AppDataSource.getRepository(Invoice);
        this.rentalRepository = AppDataSource.getRepository(Rental);
        this.returnRepository = AppDataSource.getRepository(Return);
    }

    public async getvehicles() {
        try {
            const avaVehicles = await this.vehicleRepository.find({ where: { disponible: true } });

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
                estado: 'rented',
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
            descripcion: VehicleInfo.descripcion,
            valor_dia: VehicleInfo.valor_dia
        }

        try {
            const existingVehicle = await this.vehicleRepository.findOneBy({ matricula: VehicleInfo.matricula });
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
                .where(
                    `SIMILARITY(vehicle.${filterAttribute}, :searchTerm) > 0.1 AND vehicle.disponible = :disponible`,
                    { searchTerm, disponible: true }
                )
                .orderBy(`SIMILARITY(vehicle.${filterAttribute}, :searchTerm)`, 'DESC')
                .setParameter('searchTerm', searchTerm)
                .getMany();

            return vehicles;
        } catch (error) {
            console.error('Error en búsqueda difusa:', error);
            throw new Error('Error al realizar la búsqueda difusa');
        }
    }

    public async handleDevolutionProcess(devolutionData: handleDevolutionInfo) {
        const { goodCondition, earlyReturn, earlyReturnReason, rating, rentalId } = devolutionData;

        try {
            const rental = await this.rentalRepository.findOne({
                where: { idalquiler: rentalId },
                relations: ['idcliente', 'idvehiculo', 'invoice'],
            });

            console.log("El alquiler es", rental);
            if (!rental) {
                console.log("No se encontró el alquiler");
                return false;
            }

            const id_user = rental.idcliente;
            const id_vehicle = rental.idvehiculo;

            console.log("el id del usuario es:", id_user?.id_usuario);
            console.log("el id del vehículo es", id_vehicle?.idvehiculo);

            if (!id_user || !id_vehicle) {
                console.log("No se encontró el usuario o el vehículo");
                return false;
            }

            const person = await this.personRepository.findOneBy({ id_usuario: id_user.id_usuario });
            if (!person) {
                console.log("No se encontró la persona");
                return false;
            }

            const vehicle = await this.vehicleRepository.findOneBy({ idvehiculo: id_vehicle.idvehiculo });
            if (!vehicle) {
                console.log("No se encontró el vehículo");
                return false;
            }

            const updating = await this.rentalRepository.update({ idalquiler: rentalId }, { estado: 'in progress' });
            if (!updating) {
                console.log("No se pudo actualizar el estado del alquiler");
                return false;
            }
            // Crear la entidad de Devolución (Return) y asociarla al alquiler
            const returnEntity = new Return();
            returnEntity.goodCondition = goodCondition;
            returnEntity.earlyReturn = earlyReturn;
            returnEntity.earlyReturnReason = earlyReturnReason;
            returnEntity.rating = rating;
            returnEntity.rentalId = rental;

            const savedReturn = await this.returnRepository.save(returnEntity);
            if (!savedReturn) {
                console.log("No se pudo guardar la devolución");
                return false;
            }

            console.log("Devolución registrada y alquiler actualizado correctamente.");
            return true;  // Todo salió bien
        }
        catch (error) {
            console.error('Error en el proceso de devolución:', error);
            return false;

        }

    }

    public async finishDevolution(idalquiler: number) {
        try {
            // Buscar el proceso de devolución
            const rentalReturn = await this.returnRepository.findOne({
                where: { rentalId: { idalquiler } },
                relations: ['rentalId'],  // Asegúrate de cargar la relación con 'rentalId'
            });

            if (!rentalReturn) {
                return { ok: false, message: 'Devolution process not found for this rental' };
            }
            console.log("Devolución encontrada:", rentalReturn);

            const associatedRental = rentalReturn.rentalId?.idalquiler;
            console.log("Alquiler asociado:", associatedRental);

            if (!associatedRental) {
                return { ok: false, message: 'Rental associated with the devolution not found' };
            }

            // Buscar el alquiler asociado
            const rental = await this.rentalRepository.findOne({
                where: { idalquiler: associatedRental },
                relations: ['idvehiculo'],  // Asegúrate de cargar la relación con 'idvehiculo'
            });

            if (!rental) {
                return { ok: false, message: 'Rental associated with the devolution not found' };
            }

            console.log("Alquiler encontrado:", rental);

            // Actualizar fecha de devolución y estado
            rental.fecha_devolucion = new Date();
            rental.estado = 'returned';  // Cambiar estado a 'returned'

            // Buscar el vehículo asociado al alquiler
            const associatedVehicle = rental.idvehiculo?.idvehiculo;
            const foundVehicle = await this.vehicleRepository.findOneBy({ idvehiculo: associatedVehicle });

            if (!foundVehicle) {
                return { ok: false, message: 'Vehicle associated with the rental not found' };
            }

            // Actualizar disponibilidad del vehículo
            foundVehicle.disponible = true;

            // Guardar los cambios en el vehículo
            await this.vehicleRepository.save(foundVehicle);
            console.log("Vehículo asociado:", foundVehicle);

            // Guardar los cambios en el alquiler
            await this.rentalRepository.save(rental);

            return { ok: true, message: 'Devolution process completed successfully' };

        } catch (error) {
            console.log("Ocurrió un error al finalizar el proceso de devolución", error);
            return { ok: false, message: 'An error occurred while processing the devolution' };
        }
    }
}

