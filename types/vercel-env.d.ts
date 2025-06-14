declare module '@vercel/node' {
    import { IncomingMessage, ServerResponse } from 'http';
  
    export interface VercelRequest extends IncomingMessage {
      body?: any;
      query: { [key: string]: string };
      cookies: { [key: string]: string };
    }
  
    export interface VercelResponse extends ServerResponse {
      status: (code: number) => VercelResponse;
      json: (body: any) => void;
      send: (body: any) => void;
    }
  }
  