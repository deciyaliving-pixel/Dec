import { Router, type Request, type Response } from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createStayKhojMcpServer } from "../mcp/server.js";

export const mcpRouter = Router();

// Stateless Streamable HTTP MCP endpoint: a fresh server + transport per
// request, so there is no session state to manage across calls.
mcpRouter.post("/", async (req, res) => {
  try {
    const server = createStayKhojMcpServer();
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    res.on("close", () => {
      transport.close();
      server.close();
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (err) {
    console.error("MCP request error", err);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: { code: -32603, message: "Internal server error" },
        id: null,
      });
    }
  }
});

function methodNotAllowed(_req: Request, res: Response) {
  res.status(405).json({
    jsonrpc: "2.0",
    error: { code: -32000, message: "Method not allowed. This MCP endpoint is stateless; use POST." },
    id: null,
  });
}

mcpRouter.get("/", methodNotAllowed);
mcpRouter.delete("/", methodNotAllowed);
