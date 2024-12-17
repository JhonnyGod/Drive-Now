import { Request, Response } from "express";
import { VehicleService } from "../services/vehicleservice";
import { handleDevolutionInfo, RentalInfo, updateVehicleInfo, VehicleInfo, vehicleSearchFilter } from "../types/types";

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
    const { id_usuario, id_vehiculo, fecha_inicio, fecha_fin, valor_total } = req.body;

    if (!id_usuario || !id_vehiculo || !fecha_inicio || !fecha_fin || !valor_total) {
        return res.status(400).json({ ok: false, message: 'Missing fields' });
    }

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
    const { nombre, matricula, tipovehiculo, modelo, color, cilindraje, marca, capacidad, combustible, image_src, descripcion, valor_dia } = req.body;
    if (!nombre || !matricula || !tipovehiculo || !modelo || !color || !cilindraje || !marca || !capacidad || !combustible || !image_src || !descripcion || !valor_dia) {
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

export const handleDevolution = async (req: Request<{}, {}, handleDevolutionInfo>, res: Response) => {
    const { goodCondition, earlyReturn, earlyReturnReason, rating, rentalId } = req.body;
    console.log(req.body)
    if (goodCondition == null || earlyReturn == null || !rating || !rentalId) {
        return res.status(400).json({ ok: false, message: 'Missing fields' })
    }

    try {
        const devolution = await vehicleservice.handleDevolutionProcess(req.body);

        if (!devolution) {
            return res.status(400).json({ ok: false, message: 'Vehicle return failed' })
        }

        return res.status(200).json({ ok: true, message: 'Vehicle returned, in await of manager response.' })
    } catch (error) {
        console.log(error)
        return res.status(422).json({ ok: false, message: 'Error while processing data' })

    }

}

export const finishDevolutionProcess = async (req: Request, res: Response) => {
    const idalquiler = req.body.idalquiler;
    if (!idalquiler) {
        return res.status(400).json({ ok: false, message: 'User info has missing fields' });
    }
    try {
        const handleDevolution = await vehicleservice.finishDevolution(idalquiler);

        if (!handleDevolution) {
            return res.status(400).json({ ok: false, message: 'Error while handling devolution process' });
        }
        return res.status(200).json({ ok: true, message: 'Devolution process handled' });

    } catch (error) {
        console.log(error);
        return res.status(422).json({ ok: false, message: 'Error while processing data' });

    }
}

export const editVehicleInfo = async (req: Request<{}, {}, updateVehicleInfo>, res: Response) => {
    const { idvehiculo, nombre, matricula, tipovehiculo, modelo, color, cilindraje, marca, capacidad, combustible, image_src, descripcion, valor_dia } = req.body;

    if (!nombre || !matricula || !tipovehiculo || !modelo || !color || !cilindraje || !marca || !capacidad || !combustible || !image_src || !descripcion || !valor_dia || !idvehiculo) {
        return res.status(400).json({ ok: false, message: 'Missing fields' })
    }
    try {
        const updatedVehicle = await vehicleservice.editVehicle(req.body);
        if (!updatedVehicle) {
            return res.status(400).json({ ok: false, message: 'Error while updating vehicle' })
        }
        return res.status(200).json({ ok: true, vehicle: updatedVehicle })
    } catch (error) {
        return res.status(422).json({ ok: false, message: 'Error while processing data' })
    }
}

export const deleteVehicle = async (req: Request, res: Response) => {
    const idvehiculo = req.body.idvehiculo;
    if (!idvehiculo) {
        return res.status(400).json({ ok: false, message: 'Missing fields' })
    }
    try {
        const deletedVehicle = await vehicleservice.deleteVehicle(idvehiculo);
        if (!deletedVehicle) {
            return res.status(400).json({ ok: false, message: 'Error while deleting vehicle' })
        }
        return res.status(200).json({ ok: true, message: 'Vehicle deleted' })
    } catch (error) {
        return res.status(422).json({ ok: false, message: 'Error while processing data' })
    }
}