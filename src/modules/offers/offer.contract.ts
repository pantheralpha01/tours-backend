import { randomUUID } from "crypto";
import path from "path";
import { config } from "../../config";
import { ensureDir, writeTempFile } from "../../utils/file";

const buildHtml = (data: {
  title: string;
  customerName: string;
  serviceTitle: string;
  itinerary?: Array<Record<string, unknown>>;
  priceBreakdown?: Record<string, unknown>;
  notes?: string | null;
  logoUrl?: string | null;
  signatureUrl?: string | null;
}) => `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>${data.title}</title>
<style>
body { font-family: Arial, sans-serif; margin: 40px; color: #111; }
h1 { border-bottom: 2px solid #333; padding-bottom: 10px; }
section { margin-bottom: 24px; }
.itinerary-item { margin-bottom: 12px; }
.price-table { width: 100%; border-collapse: collapse; }
.price-table th, .price-table td { border: 1px solid #ddd; padding: 8px; }
.price-table th { background: #f7f7f7; }
.logo { max-height: 80px; }
.signature { max-height: 60px; margin-top: 32px; }
</style>
</head>
<body>
  <header>
    ${data.logoUrl ? `<img src="${data.logoUrl}" class="logo" alt="Logo" />` : ""}
    <h1>${data.title}</h1>
    <p>Prepared for <strong>${data.customerName}</strong></p>
    <p>Experience: ${data.serviceTitle}</p>
  </header>

  <section>
    <h2>Itinerary</h2>
    ${(data.itinerary ?? [])
      .map(
        (item) => `<div class="itinerary-item">
        <strong>Day ${(item["day"] ?? "?")}</strong> - ${(item["title"] ?? "Untitled")}
        <p>${item["summary"] ?? ""}</p>
      </div>`
      )
      .join("")}
  </section>

  <section>
    <h2>Pricing</h2>
    <table class="price-table">
      <tbody>
        <tr><th>Base</th><td>${data.priceBreakdown?.["baseAmount"] ?? "-"}</td></tr>
        <tr><th>Addons</th><td>${data.priceBreakdown?.["addonsTotal"] ?? 0}</td></tr>
        <tr><th>Fee</th><td>${data.priceBreakdown?.["fee"]?.["amount"] ?? 0}</td></tr>
        <tr><th>Discount</th><td>- ${data.priceBreakdown?.["discount"]?.["amount"] ?? 0}</td></tr>
        <tr><th>Total</th><td><strong>${data.priceBreakdown?.["total"] ?? "-"}</strong></td></tr>
      </tbody>
    </table>
  </section>

  ${data.notes ? `<section><h2>Notes</h2><p>${data.notes}</p></section>` : ""}

  ${data.signatureUrl ? `<img src="${data.signatureUrl}" class="signature" alt="Signature" />` : ""}
</body>
</html>`;

export const offerContractService = {
  generate: async (data: {
    bookingId: string;
    customerName: string;
    serviceTitle: string;
    itinerary?: Array<Record<string, unknown>>;
    priceBreakdown?: Record<string, unknown>;
    notes?: string | null;
    logoUrl?: string | null;
    signatureUrl?: string | null;
  }) => {
    const dir = path.resolve(config.storage.tempDir, "offers");
    ensureDir(dir);
    const filename = `contract-${data.bookingId}-${randomUUID()}.html`;
    const html = buildHtml({
      title: "Experience Agreement",
      ...data,
    });

    const filepath = writeTempFile(dir, filename, html);
    const relative = filepath.replace(path.resolve(config.storage.tempDir), "");
    const url = config.storage.baseUrl
      ? `${config.storage.baseUrl.replace(/\/$/, "")}/${relative.replace(/^\\|\//, "")}`
      : filepath;

    return {
      filepath,
      url,
      metadata: {
        filename,
      },
    };
  },
};
