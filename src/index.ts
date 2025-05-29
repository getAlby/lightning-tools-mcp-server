#!/usr/bin/env node
import "websocket-polyfill";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import dotenv from "dotenv";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerRequestInvoiceTool } from "./tools/request_invoice.js";
import { registerFiatToSatsTool } from "./tools/fiat_to_sats.js";
import { registerParseInvoiceTool } from "./tools/parse_invoice.js";
import { registerFetchL402Tool } from "./tools/fetch_l402.js";
import { webln } from "@getalby/sdk";

// Load environment variables from .env file
dotenv.config();

class LightningToolsServer {
  private _server: McpServer;

  constructor() {
    this._server = new McpServer(
      {
        name: "lightning-tools-mcp-server",
        version: "1.1.0",
      },
      {}
    );

    registerRequestInvoiceTool(this._server);
    registerFiatToSatsTool(this._server);
    registerParseInvoiceTool(this._server);

    const NWC_CONNECTION_STRING = process.env.NWC_CONNECTION_STRING;
    if (!NWC_CONNECTION_STRING) {
      console.warn("NWC URL not set, some tools are unavailable");
      return;
    }
    registerFetchL402Tool(
      this._server,
      new webln.NostrWebLNProvider({
        nostrWalletConnectUrl: NWC_CONNECTION_STRING,
      })
    );
  }

  async run() {
    const transport = new StdioServerTransport();
    await this._server.connect(transport);
  }
}

new LightningToolsServer().run().catch(console.error);
