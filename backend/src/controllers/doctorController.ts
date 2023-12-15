import { StatusCodes } from "http-status-codes";
import DoctorModel, { IDoctor } from "../models/doctorModel";
import createController from "./baseController";

const doctorController = createController<IDoctor>(DoctorModel);

doctorController.create = async (req, res) => {
    const data = req.body;
    data['_id'] = data.name;

    try {
        const result = await DoctorModel.create(data);
        res.status(StatusCodes.CREATED).json(result);
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    }
    }

export default doctorController;