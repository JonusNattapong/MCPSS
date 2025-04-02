import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import config from './config';

// ไฟล์หลักของ MCP Smart Server
console.log('เริ่มต้น MCP Smart Server...');

// ตรวจสอบการตั้งค่า
const configStatus = config.validateConfig();
if (!configStatus.isValid) {
  console.error(`ข้อผิดพลาดในการตั้งค่า: ${configStatus.message}`);
  process.exit(1);
}

// สร้าง Express app
const app = express();
app.use(express.json());

// เส้นทางหลัก
app.get('/', (req, res) => {
  res.send('MCP Smart Server กำลังทำงาน');
});

// เส้นทาง health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

// Import MCP resource modules
import fileSystemResource from './resources/fileSystem';
import webBrowsingResource from './resources/webBrowsing';
import codeExecutionResource from './resources/codeExecution';
import searchResource from './resources/search';
import dateTimeResource from './resources/dateTime';
import locationResource from './resources/location';
import calculatorResource from './resources/calculator';
import websearchResource from './resources/websearch';
import { MCPResource } from './resources/types';

// Register MCP resources based on feature flags
const resources: MCPResource[] = [];

if (config.features.fileSystem) {
  resources.push(fileSystemResource);
  app.use('/mcp/filesystem', fileSystemResource.router);
  console.log('ลงทะเบียน File System Resource สำเร็จ');
}

if (config.features.webBrowsing) {
  resources.push(webBrowsingResource);
  app.use('/mcp/browser', webBrowsingResource.router);
  console.log('ลงทะเบียน Web Browsing Resource สำเร็จ');
}

if (config.features.codeExecution) {
  resources.push(codeExecutionResource);
  app.use('/mcp/code', codeExecutionResource.router);
  console.log('ลงทะเบียน Code Execution Resource สำเร็จ');
}

if (config.features.search) {
  resources.push(searchResource);
  app.use('/mcp/search', searchResource.router);
  console.log('ลงทะเบียน Search Resource สำเร็จ');
}

if (config.features.datetime) {
  resources.push(dateTimeResource);
  app.use('/mcp/datetime', dateTimeResource.router);
  console.log('ลงทะเบียน Date and Time Resource สำเร็จ');
}

if (config.features.location) {
  resources.push(locationResource);
  app.use('/mcp/location', locationResource.router);
  console.log('ลงทะเบียน Location and Weather Resource สำเร็จ');
}

if (config.features.calculator) {
  resources.push(calculatorResource);
  app.use('/mcp/calculator', calculatorResource.router);
  console.log('ลงทะเบียน Calculator Resource สำเร็จ');
}

if (config.features.websearch) {
  resources.push(websearchResource);
  app.use('/mcp/websearch', websearchResource.router);
  console.log('ลงทะเบียน Web Search Resource สำเร็จ');
}

// MCP resources discovery endpoint
app.get('/mcp/resources', (req, res) => {
  res.json({
    resources: resources.map(r => r.metadata)
  });
});

// เริ่ม server
const server = http.createServer(app);
server.listen(config.server.port, () => {
  console.log(`MCP Smart Server กำลังทำงานที่ http://${config.server.host}:${config.server.port}`);
  console.log('API Keys: ' + (config.apiKeys.anthropic ? 'Anthropic ✓' : 'Anthropic ✗') + 
                        (config.apiKeys.openai ? ' OpenAI ✓' : ' OpenAI ✗'));
  console.log(`จำนวน Resources ที่ลงทะเบียน: ${resources.length}`);
});

// จัดการ process events
process.on('SIGINT', () => {
  console.log('ปิดการทำงาน MCP Smart Server...');
  server.close(() => {
    console.log('ปิดการทำงานแล้ว');
    process.exit(0);
  });
});

export default server; 