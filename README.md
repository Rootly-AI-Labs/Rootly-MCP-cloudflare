# Rootly MCP Server for Cloudflare Workers

A remote MCP (Model Context Protocol) server written in TypeScript that provides AI agents access to the Rootly API for incident management. Users provide their own Rootly API tokens for secure access to their organization's incidents.

![Cursor IDE Integration Demo](cloudflare-mcp-demo.gif)

## Usage

### Cursor IDE Configuration

Add this to your `.cursor/mcp.json` file:

```json
{
  "mcpServers": {
    "rootly": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://incidents.rootly-mcp-server.workers.dev/sse", "--header", "Authorization:${ROOTLY_AUTH_HEADER}"],
      "env": {"ROOTLY_AUTH_HEADER": "Bearer <YOUR_ROOTLY_API_TOKEN>"}
    }
  }
}
```

Replace `<YOUR_ROOTLY_API_TOKEN>` with your actual Rootly API token.

### Example Questions

Once configured, you can ask Cursor:

- "Show me recent incidents"
- "Get details for incident ID 12345" 
- "List all teams in my organization"
- "What alerts are associated with incident 67890?"
- "Show me workflow runs"

### Available Tools

The server provides 25+ tools covering:

- **Incidents**: Get incidents, get incident alerts
- **Alerts**: Get alerts, get specific alert details
- **Teams**: List teams, get team details
- **Services**: List services, get service details  
- **Severities**: List severities, get severity details
- **Users**: List users, get user details, get current user
- **Workflows**: List workflows, get workflow details, get workflow runs
- **Environments**: List environments, get environment details
- **Functionalities**: List functionalities, get functionality details
- **Incident Types**: List incident types, get incident type details
- **Action Items**: List action items, get action items for incidents
- **Status Pages**: List status pages, get status page details

### Getting Your Rootly API Token

1. Log in to your Rootly dashboard
2. Go to **Settings** → **API Tokens**
3. Create a new token with appropriate permissions
4. Copy the token for use with the MCP server

## Deployment

### Prerequisites

1. [Node.js](https://nodejs.org/) (v18 or later)
2. [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
   ```bash
   npm install -g wrangler
   ```
3. Cloudflare account

### Quick Start

1. **Clone and setup**:
   ```bash
   git clone <your-repo>
   cd Rootly-mcp-cloudflare
   npm install
   ```

2. **Deploy to Cloudflare**:
   ```bash
   npm run deploy
   ```

3. **Get your MCP server URL**:
   After deployment, you'll get a URL like:
   ```
   https://incidents.rootly-mcp-server.workers.dev/sse
   ```


## Configuration

To modify which Rootly API endpoints are available, edit the `apiMap` object in `src/index.ts`.

## Logs

Check Cloudflare Workers logs in your Cloudflare dashboard for debugging information.