export default {
  async fetch(request: Request, env: any): Promise<Response> {
    // CORS headers for all responses
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    // Only handle /sse endpoint
    if (url.pathname !== '/sse') {
      return new Response('Not found', { 
        status: 404, 
        headers: corsHeaders 
      });
    }

    // Handle GET request for SSE connection
    if (request.method === 'GET') {
      return new Response('data: {"type":"connection","status":"connected"}\n\n', {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
        }
      });
    }

    // Handle POST request for MCP protocol
    if (request.method === 'POST') {
      try {
        const body = await request.json();
        
        // Handle MCP initialize
        if (body.method === 'initialize') {
          return new Response(JSON.stringify({
            jsonrpc: '2.0',
            id: body.id,
            result: {
              protocolVersion: '2024-11-05',
              capabilities: { tools: {} },
              serverInfo: {
                name: 'rootly-simple-mcp',
                version: '1.0.0'
              }
            }
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Handle tools/list
        if (body.method === 'tools/list') {
          const tools = [
            // Incidents
            { name: 'get_incidents', description: 'Get incidents from Rootly', inputSchema: { type: 'object', properties: { limit: { type: 'number', description: 'Number of incidents (default: 10)' } } } },
            { name: 'get_incident_alerts', description: 'Get alerts for a specific incident', inputSchema: { type: 'object', properties: { incident_id: { type: 'string', description: 'Incident ID' } }, required: ['incident_id'] } },
            
            // Alerts
            { name: 'get_alerts', description: 'Get alerts from Rootly', inputSchema: { type: 'object', properties: { limit: { type: 'number', description: 'Number of alerts (default: 10)' } } } },
            { name: 'get_alert', description: 'Get specific alert by ID', inputSchema: { type: 'object', properties: { alert_id: { type: 'string', description: 'Alert ID' } }, required: ['alert_id'] } },
            
            // Severities
            { name: 'get_severities', description: 'Get severity levels', inputSchema: { type: 'object', properties: {} } },
            { name: 'get_severity', description: 'Get specific severity by ID', inputSchema: { type: 'object', properties: { severity_id: { type: 'string', description: 'Severity ID' } }, required: ['severity_id'] } },
            
            // Teams
            { name: 'get_teams', description: 'Get teams', inputSchema: { type: 'object', properties: {} } },
            { name: 'get_team', description: 'Get specific team by ID', inputSchema: { type: 'object', properties: { team_id: { type: 'string', description: 'Team ID' } }, required: ['team_id'] } },
            
            // Services
            { name: 'get_services', description: 'Get services', inputSchema: { type: 'object', properties: {} } },
            { name: 'get_service', description: 'Get specific service by ID', inputSchema: { type: 'object', properties: { service_id: { type: 'string', description: 'Service ID' } }, required: ['service_id'] } },
            
            // Functionalities
            { name: 'get_functionalities', description: 'Get functionalities', inputSchema: { type: 'object', properties: {} } },
            { name: 'get_functionality', description: 'Get specific functionality by ID', inputSchema: { type: 'object', properties: { functionality_id: { type: 'string', description: 'Functionality ID' } }, required: ['functionality_id'] } },
            
            // Incident Types
            { name: 'get_incident_types', description: 'Get incident types', inputSchema: { type: 'object', properties: {} } },
            { name: 'get_incident_type', description: 'Get specific incident type by ID', inputSchema: { type: 'object', properties: { incident_type_id: { type: 'string', description: 'Incident Type ID' } }, required: ['incident_type_id'] } },
            
            // Action Items
            { name: 'get_incident_action_items', description: 'Get incident action items', inputSchema: { type: 'object', properties: {} } },
            { name: 'get_incident_action_item', description: 'Get specific incident action item by ID', inputSchema: { type: 'object', properties: { incident_action_item_id: { type: 'string', description: 'Incident Action Item ID' } }, required: ['incident_action_item_id'] } },
            { name: 'get_incident_action_items_for_incident', description: 'Get action items for specific incident', inputSchema: { type: 'object', properties: { incident_id: { type: 'string', description: 'Incident ID' } }, required: ['incident_id'] } },
            
            // Workflows
            { name: 'get_workflows', description: 'Get workflows', inputSchema: { type: 'object', properties: {} } },
            { name: 'get_workflow', description: 'Get specific workflow by ID', inputSchema: { type: 'object', properties: { workflow_id: { type: 'string', description: 'Workflow ID' } }, required: ['workflow_id'] } },
            { name: 'get_workflow_runs', description: 'Get workflow runs', inputSchema: { type: 'object', properties: {} } },
            { name: 'get_workflow_run', description: 'Get specific workflow run by ID', inputSchema: { type: 'object', properties: { workflow_run_id: { type: 'string', description: 'Workflow Run ID' } }, required: ['workflow_run_id'] } },
            
            // Environments
            { name: 'get_environments', description: 'Get environments', inputSchema: { type: 'object', properties: {} } },
            { name: 'get_environment', description: 'Get specific environment by ID', inputSchema: { type: 'object', properties: { environment_id: { type: 'string', description: 'Environment ID' } }, required: ['environment_id'] } },
            
            // Users
            { name: 'get_users', description: 'Get users', inputSchema: { type: 'object', properties: {} } },
            { name: 'get_user', description: 'Get specific user by ID', inputSchema: { type: 'object', properties: { user_id: { type: 'string', description: 'User ID' } }, required: ['user_id'] } },
            { name: 'get_current_user', description: 'Get current user info', inputSchema: { type: 'object', properties: {} } },
            
            // Status Pages
            { name: 'get_status_pages', description: 'Get status pages', inputSchema: { type: 'object', properties: {} } },
            { name: 'get_status_page', description: 'Get specific status page by ID', inputSchema: { type: 'object', properties: { status_page_id: { type: 'string', description: 'Status Page ID' } }, required: ['status_page_id'] } }
          ];

          return new Response(JSON.stringify({
            jsonrpc: '2.0',
            id: body.id,
            result: { tools }
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Handle tools/call
        if (body.method === 'tools/call') {
          const toolName = body.params?.name;
          const args = body.params?.arguments || {};
          
          // Get token from Authorization header or environment
          const authHeader = request.headers.get('Authorization');
          const token = authHeader?.replace('Bearer ', '') || env.ROOTLY_API_TOKEN;
          
          if (!token) {
            return new Response(JSON.stringify({
              jsonrpc: '2.0',
              id: body.id,
              error: {
                code: -32602,
                message: 'ROOTLY_API_TOKEN required. Use Authorization: Bearer <token> header.'
              }
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }

          // Map tool names to API endpoints
          const apiMap: Record<string, string> = {
            // Incidents
            'get_incidents': '/v1/incidents',
            'get_incident_alerts': `/v1/incidents/${args.incident_id}/alerts`,
            
            // Alerts
            'get_alerts': '/v1/alerts',
            'get_alert': `/v1/alerts/${args.alert_id}`,
            
            // Severities
            'get_severities': '/v1/severities',
            'get_severity': `/v1/severities/${args.severity_id}`,
            
            // Teams
            'get_teams': '/v1/teams',
            'get_team': `/v1/teams/${args.team_id}`,
            
            // Services
            'get_services': '/v1/services',
            'get_service': `/v1/services/${args.service_id}`,
            
            // Functionalities
            'get_functionalities': '/v1/functionalities',
            'get_functionality': `/v1/functionalities/${args.functionality_id}`,
            
            // Incident Types
            'get_incident_types': '/v1/incident_types',
            'get_incident_type': `/v1/incident_types/${args.incident_type_id}`,
            
            // Action Items
            'get_incident_action_items': '/v1/incident_action_items',
            'get_incident_action_item': `/v1/incident_action_items/${args.incident_action_item_id}`,
            'get_incident_action_items_for_incident': `/v1/incidents/${args.incident_id}/action_items`,
            
            // Workflows
            'get_workflows': '/v1/workflows',
            'get_workflow': `/v1/workflows/${args.workflow_id}`,
            'get_workflow_runs': '/v1/workflow_runs',
            'get_workflow_run': `/v1/workflow_runs/${args.workflow_run_id}`,
            
            // Environments
            'get_environments': '/v1/environments',
            'get_environment': `/v1/environments/${args.environment_id}`,
            
            // Users
            'get_users': '/v1/users',
            'get_user': `/v1/users/${args.user_id}`,
            'get_current_user': '/v1/users/me',
            
            // Status Pages
            'get_status_pages': '/v1/status_pages',
            'get_status_page': `/v1/status_pages/${args.status_page_id}`
          };

          const apiPath = apiMap[toolName];
          if (!apiPath) {
            return new Response(JSON.stringify({
              jsonrpc: '2.0',
              id: body.id,
              error: {
                code: -32601,
                message: 'Unknown tool'
              }
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }

          // Add pagination for list endpoints
          let url = `https://api.rootly.com${apiPath}`;
          if (toolName.startsWith('get_') && !apiPath.includes('{') && args.limit) {
            url += `?page[size]=${args.limit}`;
          } else if (toolName === 'get_incidents' || toolName === 'get_alerts') {
            url += `?page[size]=${args.limit || 10}`;
          }

          // Call Rootly API
          const response = await fetch(url, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/vnd.api+json'
            }
          });

          if (!response.ok) {
            return new Response(JSON.stringify({
              jsonrpc: '2.0',
              id: body.id,
              error: {
                code: -32603,
                message: `Rootly API error: ${response.status} - ${response.statusText}`
              }
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }

          const data = await response.json();
          
          return new Response(JSON.stringify({
            jsonrpc: '2.0',
            id: body.id,
            result: {
              content: [{
                type: 'text',
                text: JSON.stringify(data, null, 2)
              }]
            }
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        return new Response(JSON.stringify({
          jsonrpc: '2.0',
          id: body.id,
          error: {
            code: -32601,
            message: 'Method not found'
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      } catch (error) {
        return new Response(JSON.stringify({
          jsonrpc: '2.0',
          error: {
            code: -32700,
            message: 'Parse error'
          }
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }
};