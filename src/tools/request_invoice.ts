import { LightningAddress } from "@getalby/lightning-tools";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerRequestInvoiceTool(server: McpServer) {
  server.tool(
    "request_invoice",
    "Request an invoice from a lightning address",
    {
      lightning_address: z
        .string()
        .describe("the recipient's lightning address"),
      amount: z.number().describe("amount in sats"),
      description: z
        .string()
        .describe("note, memo or description describing the invoice")
        .optional(),
      payer_data: z
        .object({})
        .passthrough()
        .describe(
          "metadata to include with the payment such as the payer's name"
        )
        .optional(),
    },
    async (params) => {
      const ln = new LightningAddress(params.lightning_address);

      // fetch the LNURL data
      await ln.fetch();

      const invoice = await ln.requestInvoice({
        satoshi: params.amount,
        comment: params.description,
        payerdata: params.payer_data,
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(invoice, null, 2),
          },
        ],
      };
    }
  );
}
