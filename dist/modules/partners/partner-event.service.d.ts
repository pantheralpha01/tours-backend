import { PartnerEventType } from "@prisma/client";
import { PaginatedResponse } from "../../utils/pagination";
export declare const partnerEventService: {
    list: (params: {
        partnerId: string;
        page?: number;
        limit?: number;
        type?: PartnerEventType;
        dateFrom?: Date;
        dateTo?: Date;
        sort?: string;
    }) => Promise<PaginatedResponse<any>>;
};
//# sourceMappingURL=partner-event.service.d.ts.map