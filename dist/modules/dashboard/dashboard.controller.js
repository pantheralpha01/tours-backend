"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardController = void 0;
const dashboard_service_1 = require("./dashboard.service");
exports.dashboardController = {
    summary: async (req, res) => {
        const role = (req.user?.role ?? "AGENT");
        const agentId = role === "AGENT" ? req.user?.id : undefined;
        const summary = await dashboard_service_1.dashboardService.getSummary({ role, agentId });
        return res.status(200).json(summary);
    },
};
//# sourceMappingURL=dashboard.controller.js.map