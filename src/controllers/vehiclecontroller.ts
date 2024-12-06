import { Request, Response } from "express";
import { VehicleService } from "../services/vehicleservice";
import { RentalInfo, VehicleInfo, vehicleSearchFilter } from "../types/types";

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
export const rentVehicle = async (req: Request<{}, {}, RentalInfo>, res: Response) => {
    try {
        const rent = await vehicleservice.rentvehicle(req.body);
        if (!rent) {
            return res.status(400).json({ ok: false, message: 'No vehicles found' });
        }
        return res.status(200).json({ ok: true, data: rent });

    } catch (error) {
        return res.status(422).json({ ok: false, message: 'Error while processing data' });
    }
}
export const addVehicle = async (req: Request<{}, {}, VehicleInfo>, res: Response) => {
    const { nombre, matricula, tipovehiculo, modelo, color, cilindraje, marca, capacidad, combustible, image_src } = req.body;
    if (!nombre || !matricula || !tipovehiculo || !modelo || !color || !cilindraje || !marca || !capacidad || !combustible || !image_src) {
        return res.status(400).json({ ok: false, message: 'Missing fields' })
    }
    try {
        const newVehicle = await vehicleservice.addvehicle(req.body);
        if (!newVehicle) {
            return res.status(400).json({ ok: false, message: 'Error while adding vehicle' })
        }
        return res.status(200).json({ ok: true, vehicle: newVehicle })
    } catch (error) {
        return res.status(422).json({ ok: false, message: 'Error while processing data' })
    }
}

export const searchVehicle = async (req: Request<{}, {}, vehicleSearchFilter>, res: Response) => {
    const { searchterm, filterattribute } = req.body;
    const validAttributes = ['nombre', 'capacidad', 'tipovehiculo', 'modelo', 'color', 'cilindraje', 'marca', 'combustible'];

    if (!validAttributes.includes(filterattribute)) {
        console.log(filterattribute)
        return res.status(400).json({ ok: false, message: 'Invalid filter attribute' })   
    }
    if (!searchterm) {
        return res.status(400).json({ ok: false, message: 'No search term provided' })
    }
    if (!filterattribute) {
        return res.status(400).json({ ok: false, message: 'No filter attribute provided' })
    }
    try {
        const search = await vehicleservice.fuzzySearchVehicles(req.body);
        if (!search) {
            return res.status(400).json({ ok: false, message: 'No vehicles found' })
        }
        return res.status(200).json({ ok: true, vehicles: search })
    }
    catch (error) {
        return res.status(422).json({ ok: false, message: 'Error while processing data' })

    }
}
