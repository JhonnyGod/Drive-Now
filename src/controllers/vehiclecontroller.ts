import { Request, Response } from "express";
import { VehicleService } from "../services/vehicleservice";

const vehicleservice = new VehicleService();

export const getVehicles = async (req: Request, res: Response) => {
    try {
        const vehicles = await vehicleservice.getvehicles();
        if (!vehicles) {
            return res.status(400).json({ ok: false, message: 'No vehicles found' });
        }
        return res.status(200).json({ ok: true, vehiculos: vehicles });
        
    } catch (error) {
        return res.status(422).json({ ok: false, message: 'Error while processing data' });
    }
}
