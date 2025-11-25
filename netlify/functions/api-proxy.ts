/**
 * Netlify Serverless Function - API Proxy
 * 
 * This function proxies requests to the DeepSeek API, adding the API key
 * from environment variables. This keeps the API key secure on the server side.
 */

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1';

interface NetlifyEvent {
  httpMethod: string;
  body: string | null;
  queryStringParameters: Record<string, string> | null;
}

const handler = async (event: NetlifyEvent) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Get API key from environment variable
  const apiKey = process.env.DEEPSEEK_API_KEY;
  
  if (!apiKey) {
    console.error('[API Proxy] DEEPSEEK_API_KEY environment variable is not set');
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'API configuration error',
        message: '服务器未配置 API Key，请联系管理员或使用自定义 API Key'
      }),
    };
  }

  try {
    // Parse the request body
    const body = event.body ? JSON.parse(event.body) : {};
    
    // Get the endpoint from query parameters or default to chat/completions
    const endpoint = event.queryStringParameters?.endpoint || '/chat/completions';
    
    // Forward the request to DeepSeek API
    const response = await fetch(`${DEEPSEEK_API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    // Get response data
    const data = await response.text();
    
    // Return the response
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: data,
    };
  } catch (error: any) {
    console.error('[API Proxy] Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Proxy error',
        message: error.message || '请求失败，请稍后重试'
      }),
    };
  }
};

export { handler };
