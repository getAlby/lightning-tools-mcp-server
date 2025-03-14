#!/usr/bin/env node
import "websocket-polyfill";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import dotenv from "dotenv";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerRequestInvoiceTool } from "./tools/request_invoice.js";

// Load environment variables from .env file
dotenv.config();

class LightningToolsServer {
  private _server: McpServer;

  constructor() {
    this._server = new McpServer(
      {
        name: "lightning-tools-mcp-server",
        version: "1.0.0",
      },
      {}
    );

    registerRequestInvoiceTool(this._server);
  }

  async run() {
    const transport = new StdioServerTransport();
    await this._server.connect(transport);
  }
}

new LightningToolsServer().run().catch(console.error);
