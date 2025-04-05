import process from "node:process";

import { AvaConversionApi, GaebConversionApi } from "@dangl/avacloud-client-node";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { z } from "zod";

import { getGaebFile, getOAuth2AccessToken } from "./utils.ts";

const { clientId, clientSecret, tokenUrl, avacloudBaseUrl } = process.env;

const gaebConversionClient = new GaebConversionApi();
const avaConversionClient = new AvaConversionApi();

const setupClients = async () => {
  const accessToken = await getOAuth2AccessToken(
    clientId,
    clientSecret,
    tokenUrl,
  );

  gaebConversionClient.accessToken = accessToken;
  gaebConversionClient.basePath = avacloudBaseUrl;
  
  avaConversionClient.accessToken = accessToken;
  avaConversionClient.basePath = avacloudBaseUrl;
};

const server = new McpServer({
  name: "AvaCloud - MCP",
  version: "1.0.0",
});

server.tool(
  "convert_gaeb_to_flat_ava",
  { file: z.string().describe("GAEB file path") },
  async ({ file }) => {
    await setupClients();

    try {
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error occurred';
      
      return {
        content: [
          {
            type: "text",
            text: `Error converting GAEB to Flat AVA: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  },
);

server.tool(
  "convert_gaeb_to_ava",
  { file: z.string().describe("GAEB file path") },
  async ({ file }) => {
    await setupClients();

    try {
      const fileParam = getGaebFile(file);
      const { result } =
        await gaebConversionClient.gaebConversionConvertToAva(fileParam);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result),
          },
        ],
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error occurred';
      
      return {
        content: [
          {
            type: "text",
            text: `Error converting GAEB to AVA: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  },
);

server.tool(
  "convert_ava_to_gaeb",
  { avaJson: z.string().describe("AVA JSON string") },
  async ({ avaJson }) => {
    await setupClients();

    try {
      // Parse the JSON string to ensure it's valid
      const avaData = JSON.parse(avaJson);
      
      // Convert AVA JSON to GAEB
      const { result } = await avaConversionClient.avaConversionConvertToGaeb(avaData);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result),
          },
        ],
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error occurred';
      
      return {
        content: [
          {
            type: "text",
            text: `Error converting AVA to GAEB: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  },
);

const transport = new StdioServerTransport();
server
  .connect(transport)
  .then(() => {})
  .catch(() => {});
