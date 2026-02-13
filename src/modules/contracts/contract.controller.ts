import { Request, Response } from "express";
import { contractService } from "./contract.service";
import {
  contractIdSchema,
  createContractSchema,
  listContractSchema,
  updateContractSchema,
} from "./contract.validation";

export const contractController = {
  create: async (req: Request, res: Response) => {
    const payload = createContractSchema.parse(req.body);
    const contract = await contractService.create(payload);
    return res.status(201).json(contract);
  },

  list: async (req: Request, res: Response) => {
    const params = listContractSchema.parse(req.query);
    const result = await contractService.list(params);
    return res.status(200).json(result);
  },

  getById: async (req: Request, res: Response) => {
    const { id } = contractIdSchema.parse(req.params);
    const contract = await contractService.getById(id);
    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }
    return res.status(200).json(contract);
  },

  update: async (req: Request, res: Response) => {
    const { id } = contractIdSchema.parse(req.params);
    const payload = updateContractSchema.parse(req.body);
    const contract = await contractService.update(id, payload);
    return res.status(200).json(contract);
  },

  remove: async (req: Request, res: Response) => {
    const { id } = contractIdSchema.parse(req.params);
    await contractService.remove(id);
    return res.status(204).send();
  },
};
