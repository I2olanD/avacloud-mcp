import process from "node:process";

import { GaebConversionApi } from "@dangl/avacloud-client-node";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { z } from "zod";

import { getGaebFile, getOAuth2AccessToken } from "./utils.ts";

const { clientId, clientSecret, tokenUrl, avacloudBaseUrl } = process.env;

const gaebConversionClient = new GaebConversionApi();

const setupClient = async () => {
  const accessToken = await getOAuth2AccessToken(
    clientId,
    clientSecret,
    tokenUrl,
  );

  gaebConversionClient.accessToken = accessToken;
  gaebConversionClient.basePath = avacloudBaseUrl;
};

const server = new McpServer({
  name: "Neo4J - MCP",
  version: "1.0.0",
});

server.tool(
  "convert_gaeb_to_flat_ava",
  { file: z.string().describe("GAEB") },
  async ({ file }) => {
    await setupClient();

    const fileParam = getGaebFile(file);
    const { result } =
      await gaebConversionClient.gaebConversionConvertToFlatAva(fileParam);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result),
        },
      ],
    };
  },
);

const transport = new StdioServerTransport();
server
  .connect(transport)
  .then(() => {})
  .catch(() => {});
