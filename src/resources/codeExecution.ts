import { Router } from 'express';
import { exec } from 'child_process';
import { MCPResource, MCPTool } from './types';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const execPromise = promisify(exec);
const router = Router();

// กำหนดเครื่องมือสำหรับ Code Execution Resource
const tools: MCPTool[] = [
  {
    id: 'executeCode',
    name: 'Execute Code',
    description: 'รันโค้ดในสภาพแวดล้อมท้องถิ่น',
    parameters: [
      {
        name: 'code',
        description: 'โค้ดที่ต้องการรัน',
        type: 'string',
        required: true
      },
      {
        name: 'language',
        description: 'ภาษาของโค้ด (python, javascript, bash)',
        type: 'string',
        required: true
      }
    ],
    returns: {
      name: 'result',
      type: 'object',
      description: 'ผลลัพธ์การรันโค้ด รวมถึง stdout, stderr, และ exit code'
    }
  }
];

// สร้าง endpoint สำหรับรันโค้ด
router.post('/execute', async (req, res) => {
  try {
    const { code, language } = req.body;
    
    if (!code || !language) {
      return res.status(400).json({ 
        error: 'กรุณาระบุทั้งโค้ดและภาษา' 
      });
    }
    
    // ตรวจสอบภาษาที่รองรับ
    const supportedLanguages = ['python', 'javascript', 'bash'];
    if (!supportedLanguages.includes(language.toLowerCase())) {
      return res.status(400).json({ 
        error: `ภาษา ${language} ไม่รองรับ. รองรับเฉพาะ: ${supportedLanguages.join(', ')}` 
      });
    }
    
    // สร้างไฟล์ชั่วคราวสำหรับรันโค้ด
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    
    let tempFilePath;
    let command;
    
    // กำหนดคำสั่งตามภาษา
    switch (language.toLowerCase()) {
      case 'python':
        tempFilePath = path.join(tempDir, `temp_${Date.now()}.py`);
        fs.writeFileSync(tempFilePath, code);
        command = `python ${tempFilePath}`;
        break;
      case 'javascript':
        tempFilePath = path.join(tempDir, `temp_${Date.now()}.js`);
        fs.writeFileSync(tempFilePath, code);
        command = `node ${tempFilePath}`;
        break;
      case 'bash':
        tempFilePath = path.join(tempDir, `temp_${Date.now()}.sh`);
        fs.writeFileSync(tempFilePath, code);
        command = `bash ${tempFilePath}`;
        break;
    }
    
    // รันคำสั่ง
    const { stdout, stderr } = await execPromise(command as string);
    
    // ลบไฟล์ชั่วคราว
    fs.unlinkSync(tempFilePath as string);
    
    res.json({
      result: {
        stdout,
        stderr,
        exitCode: 0
      }
    });
  } catch (error: any) {
    console.error('ข้อผิดพลาดในการรันโค้ด:', error);
    res.status(500).json({ 
      result: {
        stdout: '',
        stderr: error.message,
        exitCode: 1
      }
    });
  }
});

// สร้าง MCP Resource
const codeExecutionResource: MCPResource = {
  metadata: {
    id: 'codeexecution',
    name: 'Code Execution',
    description: 'รันโค้ดในภาษาต่างๆ',
    version: '1.0.0',
    tools
  },
  router
};

export default codeExecutionResource; 