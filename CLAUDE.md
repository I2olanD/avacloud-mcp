# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Development
- `yarn dev` - Run TypeScript compiler in watch mode
- `yarn build` - Build the TypeScript project
- `node dist/main.js` - Run the compiled server

### Environment Setup
The server requires these environment variables:
- `clientId` - OAuth2 client ID for AvaCloud
- `clientSecret` - OAuth2 client secret for AvaCloud
- `tokenUrl` - OAuth2 token endpoint URL
- `avacloudBaseUrl` - Base URL for AvaCloud API

## High-Level Architecture

This is an MCP (Model Context Protocol) server that provides GAEB/AVA file conversion capabilities via AvaCloud services.

### Core Components

1. **MCP Server (main.ts)**: Implements three conversion tools exposed via MCP:
   - `convert_gaeb_to_flat_ava` - Converts GAEB files to Flat AVA format
   - `convert_gaeb_to_ava` - Converts GAEB files to standard AVA format  
   - `convert_ava_to_gaeb` - Converts AVA JSON to GAEB format

2. **Authentication (utils.ts)**: Handles OAuth2 client credentials flow to obtain access tokens for AvaCloud API

3. **File Handling (utils.ts)**: Reads GAEB files from disk and prepares form data for API upload

### Key Implementation Details

- Uses Node.js runtime with TypeScript
- Communicates via stdio transport for MCP protocol
- All API interactions use the `@dangl/avacloud-client-node` client library
- File uploads use multipart form data with proper MIME types
- Error responses include descriptive messages for troubleshooting

### Development Notes

- This project uses npm/yarn to manage dependencies
- No test framework is currently configured
- The project follows MCP server patterns from `@modelcontextprotocol/sdk`
- GAEB and AVA are industry-standard formats for construction/billing data exchange