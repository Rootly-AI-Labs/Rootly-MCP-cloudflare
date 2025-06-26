# Rootly MCP Server for Cloudflare Workers

A remote MCP (Model Context Protocol) server that provides AI agents access to the Rootly API for incident management. Users provide their own Rootly API tokens for secure access to their organization's incidents.

## Features

- **User-provided API tokens**: Each user connects with their own Rootly API token via Authorization headers
- **Remote hosting**: Deployed on Cloudflare Workers for global accessibility
- **25+ API endpoints**: Access to incidents, alerts, teams, services, workflows, and more
- **Cursor IDE integration**: Simple configuration with mcp-remote
- **Server-Sent Events**: SSE transport for MCP protocol
- **CORS support**: Cross-origin requests for web-based MCP clients

## Deployment

### Prerequisites

1. [Node.js](https://nodejs.org/) (v18 or later)
2. [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
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

### Local Development

```bash
npm run dev
```

Server will be available at `http://localhost:8787/sse`

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

## Security

- API tokens are passed via Authorization headers and not stored
- All communication uses HTTPS
- Follows Rootly's API rate limits
- Only predefined API endpoints are accessible via the tool mapping

## Configuration

To modify which Rootly API endpoints are available, edit the `apiMap` object in `src/index.ts`.

## Troubleshooting

### Common Issues

1. **Authentication errors**: Verify your Rootly API token is valid and has proper permissions
2. **Connection issues**: Ensure you're using the correct server URL with `/sse` endpoint
3. **Missing tools**: Check that your MCP client successfully connects and loads the tool list

### Logs

Check Cloudflare Workers logs in your Cloudflare dashboard for debugging information.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `npm run dev`
5. Deploy to staging with `npm run deploy`
6. Submit a pull request