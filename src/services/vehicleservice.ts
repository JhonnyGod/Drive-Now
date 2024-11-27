import { Repository } from "typeorm";
import { AppDataSource } from "../database/connection";
import { Vehicle } from "../entities/Vehicles";
import { User } from "../entities/User";
import { VehicleInfo } from "../types/types";
import { ok } from "assert";
const nodemailer = require("nodemailer");


export class VehicleService {

    private vehicleRepository: Repository<Vehicle>;
    private userRepository: Repository<User>;

    constructor() {
        this.vehicleRepository = AppDataSource.getRepository(Vehicle);
        this.userRepository = AppDataSource.getRepository(User);
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
                tipoCombustible: vehicle.combustible,
                image_src: vehicle.image_src
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
            const user = await this.userRepository.findOne({ where: { id: RentalInfo.id_user } });

            if (!user) {
                return false;
            }
            const user_email = user.email;

            const vehicle = await this.vehicleRepository.findOne({ where: { idvehiculo: RentalInfo.idvehiculo } });
            if (!vehicle) {
                return false;
            }
            const vehicle_name = vehicle.nombre;
            const vehicle_plate = vehicle.matricula;

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            })

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user_email,
                subject: 'Notificación de Alquiler',
                text: `
                    You have just confirmed the rental of the vehicle: ${vehicle_name} with license plate: ${vehicle_plate}.
                    ¿No alquilaste este vehículo? Contáctanos.
                `,
                html: `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Notificación de Alquiler</title>
                    </head>
                    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <header style="background-color: #4a90e2; color: #ffffff; padding: 20px; text-align: center;">
                            <h1 style="margin: 0;">Notificación de Alquiler</h1>
                        </header>
                        
                        <main style="padding: 20px;">
                            <p>You have just confirmed the rental of the vehicle:</p>
                            
                            <ul>
                                <li><strong>Vehicle Name:</strong> ${vehicle_name}</li>
                                <li><strong>License Plate:</strong> ${vehicle_plate}</li>
                            </ul>
                            
                            <p>Thank you for choosing Drive Now! We hope you enjoy your rental experience.</p>
                        </main>
                        
                        <footer style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px;">
                            <p>&copy; 2023 Drive Now. All rights reserved.</p>
                            <p>
                                <a href="https://www.drivenow.com/terms" style="color: #4a90e2; text-decoration: none;">Terms of Service</a> | 
                                <a href="https://www.drivenow.com/privacy" style="color: #4a90e2; text-decoration: none;">Privacy Policy</a>
                            </p>
                        </footer>
                    </body>
                    </html>
                `,
            };

            const send = await transporter.sendMail(mailOptions);
            if (send) {
                console.log("Email Sent")
                return { ok: true, message: "Notification sent" };
            }
            return true;
        } catch (error) {
            console.log("Ocurrió un error al alquilar el vehículo", error);
            return false;
        }
    }

    public async addvehicle(VehicleInfo: VehicleInfo) {
        try {
            const existingVehicle = await this.vehicleRepository.findOneBy({matricula: VehicleInfo.matricula});
            if(existingVehicle){
                return{ok: false, message: 'Vehicle already exists'}
            }
            const newVehicle = await this.vehicleRepository.save(VehicleInfo);
            return newVehicle;
        } catch (error) {
            
        }
    }
}