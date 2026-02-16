"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contractController = void 0;
const contract_service_1 = require("./contract.service");
const contract_validation_1 = require("./contract.validation");
exports.contractController = {
    create: async (req, res) => {
        const payload = contract_validation_1.createContractSchema.parse(req.body);
        const contract = await contract_service_1.contractService.create(payload);
        return res.status(201).json(contract);
    },
    list: async (req, res) => {
        const params = contract_validation_1.listContractSchema.parse(req.query);
        const result = await contract_service_1.contractService.list(params);
        return res.status(200).json(result);
    },
    getById: async (req, res) => {
        const { id } = contract_validation_1.contractIdSchema.parse(req.params);
        const contract = await contract_service_1.contractService.getById(id);
        if (!contract) {
            return res.status(404).json({ message: "Contract not found" });
        }
        return res.status(200).json(contract);
    },
    update: async (req, res) => {
        const { id } = contract_validation_1.contractIdSchema.parse(req.params);
        const payload = contract_validation_1.updateContractSchema.parse(req.body);
        const contract = await contract_service_1.contractService.update(id, payload);
        return res.status(200).json(contract);
    },
    remove: async (req, res) => {
        const { id } = contract_validation_1.contractIdSchema.parse(req.params);
        await contract_service_1.contractService.remove(id);
        return res.status(204).send();
    },
};
//# sourceMappingURL=contract.controller.js.map