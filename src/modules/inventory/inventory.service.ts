import { inventoryRepository } from "./inventory.repository";

export const inventoryService = {
  create: (data: {
    partnerId: string;
    title: string;
    description?: string;
    price: number;
    status?: "DRAFT" | "ACTIVE" | "INACTIVE";
  }) => inventoryRepository.create(data),

  list: (params?: { createdById?: string }) =>
    inventoryRepository.findMany(params),

  getById: (id: string) => inventoryRepository.findById(id),

  update: (
    id: string,
    data: {
      partnerId?: string;
      title?: string;
      description?: string;
      price?: number;
      status?: "DRAFT" | "ACTIVE" | "INACTIVE";
    }
  ) => inventoryRepository.update(id, data),

  remove: (id: string) => inventoryRepository.remove(id),
};
