"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryService = void 0;
const inventory_repository_1 = require("./inventory.repository");
exports.inventoryService = {
    create: (data) => inventory_repository_1.inventoryRepository.create(data),
    list: (params) => inventory_repository_1.inventoryRepository.findMany(params),
    getById: (id) => inventory_repository_1.inventoryRepository.findById(id),
    update: (id, data) => inventory_repository_1.inventoryRepository.update(id, data),
    remove: (id) => inventory_repository_1.inventoryRepository.remove(id),
};
//# sourceMappingURL=inventory.service.js.map