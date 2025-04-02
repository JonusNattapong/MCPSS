import express, { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { MCPResource, MCPTool } from './types';

const router = Router();

// กำหนดเครื่องมือสำหรับ File System Resource
const tools: MCPTool[] = [
  {
    id: 'listDirectory',
    name: 'List Directory',
    description: 'แสดงรายการไฟล์และโฟลเดอร์ในไดเรกทอรี',
    parameters: [
      {
        name: 'path',
        description: 'เส้นทางไดเรกทอรีที่ต้องการดู',
        type: 'string',
        required: true
      }
    ],
    returns: {
      name: 'fileList',
      type: 'array',
      description: 'รายการไฟล์และโฟลเดอร์'
    }
  },
  {
    id: 'readFile',
    name: 'Read File',
    description: 'อ่านเนื้อหาของไฟล์',
    parameters: [
      {
        name: 'path',
        description: 'เส้นทางไฟล์ที่ต้องการอ่าน',
        type: 'string',
        required: true
      }
    ],
    returns: {
      name: 'content',
      type: 'string',
      description: 'เนื้อหาของไฟล์'
    }
  }
];

// สร้าง endpoint สำหรับ List Directory
router.post('/list', (req, res) => {
  try {
    const { path: dirPath } = req.body;
    
    if (!dirPath) {
      return res.status(400).json({ error: 'กรุณาระบุเส้นทางไดเรกทอรี' });
    }
    
    const absolutePath = path.resolve(dirPath);
    const files = fs.readdirSync(absolutePath);
    
    const fileList = files.map(file => {
      const filePath = path.join(absolutePath, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        path: filePath,
        isDirectory: stats.isDirectory(),
        size: stats.size,
        modified: stats.mtime
      };
    });
    
    res.json({ files: fileList });
  } catch (error) {
    console.error('ข้อผิดพลาดในการอ่านไฟล์:', error);
    const errorMessage = error instanceof Error ? error.message : 'ข้อผิดพลาดที่ไม่ทราบสาเหตุ';
    res.status(500).json({ error: `ข้อผิดพลาด: ${errorMessage}` });
  }
});

// สร้าง endpoint สำหรับ Read File
router.post('/read', (req, res) => {
  try {
    const { path: filePath } = req.body;
    
    if (!filePath) {
      return res.status(400).json({ error: 'กรุณาระบุเส้นทางไฟล์' });
    }
    
    const absolutePath = path.resolve(filePath);
    
    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ error: 'ไม่พบไฟล์' });
    }
    
    if (fs.statSync(absolutePath).isDirectory()) {
      return res.status(400).json({ error: 'เส้นทางที่ระบุเป็นไดเรกทอรี ไม่ใช่ไฟล์' });
    }
    
    const content = fs.readFileSync(absolutePath, 'utf-8');
    res.json({ content });
  } catch (error) {
    console.error('ข้อผิดพลาดในการอ่านไฟล์:', error);
    const errorMessage = error instanceof Error ? error.message : 'ข้อผิดพลาดที่ไม่ทราบสาเหตุ';
    res.status(500).json({ error: `ข้อผิดพลาด: ${errorMessage}` });
  }
});

// สร้าง MCP Resource
const fileSystemResource: MCPResource = {
  metadata: {
    id: 'filesystem',
    name: 'File System',
    description: 'เข้าถึงไฟล์และไดเรกทอรีในระบบ',
    version: '1.0.0',
    tools
  },
  router
};

export default fileSystemResource; 