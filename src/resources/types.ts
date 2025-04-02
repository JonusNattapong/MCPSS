import { Router } from 'express';

// ประเภทพื้นฐานสำหรับ MCP Resource
export interface MCPResource {
  // metadata สำหรับอธิบาย resource
  metadata: {
    id: string;
    name: string;
    description: string;
    version: string;
    tools: MCPTool[];
  };
  // Express router สำหรับจัดการคำขอ
  router: Router;
}

// ประเภทสำหรับ MCP Tool
export interface MCPTool {
  id: string;
  name: string;
  description: string;
  parameters: MCPParameter[];
  returns?: MCPParameter;
}

// ประเภทสำหรับพารามิเตอร์
export interface MCPParameter {
  name: string;
  description?: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required?: boolean;
  schema?: any;
} 