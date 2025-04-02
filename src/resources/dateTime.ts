import { Router } from 'express';
import { MCPResource, MCPTool } from './types';

const router = Router();

// กำหนดเครื่องมือสำหรับ DateTime Resource
const tools: MCPTool[] = [
  {
    id: 'getCurrentTime',
    name: 'Get Current Time',
    description: 'ดึงเวลาปัจจุบัน',
    parameters: [
      {
        name: 'timezone',
        description: 'โซนเวลา (เช่น Asia/Bangkok, UTC)',
        type: 'string',
        required: false
      },
      {
        name: 'format',
        description: 'รูปแบบเวลา (ISO, FULL, TIME_ONLY, DATE_ONLY)',
        type: 'string',
        required: false
      }
    ],
    returns: {
      name: 'time',
      type: 'string',
      description: 'เวลาปัจจุบัน'
    }
  },
  {
    id: 'getDateDifference',
    name: 'Get Date Difference',
    description: 'คำนวณระยะเวลาระหว่างวันที่',
    parameters: [
      {
        name: 'startDate',
        description: 'วันที่เริ่มต้น (ISO format)',
        type: 'string',
        required: true
      },
      {
        name: 'endDate',
        description: 'วันที่สิ้นสุด (ISO format, ถ้าไม่ระบุจะใช้วันที่ปัจจุบัน)',
        type: 'string',
        required: false
      },
      {
        name: 'unit',
        description: 'หน่วยผลลัพธ์ (days, hours, minutes, seconds)',
        type: 'string',
        required: false
      }
    ],
    returns: {
      name: 'difference',
      type: 'object',
      description: 'ผลต่างระหว่างวันที่'
    }
  }
];

// สร้าง endpoint สำหรับเวลาปัจจุบัน
router.post('/current-time', (req, res) => {
  try {
    const { timezone = 'UTC', format = 'ISO' } = req.body;
    
    // สร้างวัตถุวันที่
    const now = new Date();
    
    // จัดการรูปแบบผลลัพธ์
    let formattedTime = '';
    
    // ตั้งค่าตัวเลือกสำหรับการจัดรูปแบบ
    const options: Intl.DateTimeFormatOptions = { timeZone: timezone };
    
    switch (format.toUpperCase()) {
      case 'FULL':
        options.weekday = 'long';
        options.year = 'numeric';
        options.month = 'long';
        options.day = 'numeric';
        options.hour = '2-digit';
        options.minute = '2-digit';
        options.second = '2-digit';
        formattedTime = new Intl.DateTimeFormat('th-TH', options).format(now);
        break;
      case 'TIME_ONLY':
        options.hour = '2-digit';
        options.minute = '2-digit';
        options.second = '2-digit';
        formattedTime = new Intl.DateTimeFormat('th-TH', options).format(now);
        break;
      case 'DATE_ONLY':
        options.year = 'numeric';
        options.month = 'long';
        options.day = 'numeric';
        formattedTime = new Intl.DateTimeFormat('th-TH', options).format(now);
        break;
      case 'ISO':
      default:
        // ใช้ ISO format แต่ปรับโซนเวลา (ทำได้เพียงคร่าวๆ เนื่องจาก Date.toISOString() ใช้ UTC เสมอ)
        formattedTime = now.toISOString();
        break;
    }
    
    res.json({ time: formattedTime, timezone, format });
  } catch (error: any) {
    console.error('ข้อผิดพลาดในการแสดงเวลา:', error);
    res.status(500).json({ error: `ข้อผิดพลาด: ${error.message}` });
  }
});

// สร้าง endpoint สำหรับความต่างของวันที่
router.post('/date-difference', (req, res) => {
  try {
    const { startDate, endDate = new Date().toISOString(), unit = 'days' } = req.body;
    
    if (!startDate) {
      return res.status(400).json({ error: 'กรุณาระบุวันที่เริ่มต้น (startDate)' });
    }
    
    // แปลงเป็นวัตถุ Date
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // คำนวณความแตกต่างในมิลลิวินาที
    const diffMs = end.getTime() - start.getTime();
    
    // แปลงตามหน่วยที่ต้องการ
    let difference: number;
    let unitFormatted: string;
    
    switch (unit.toLowerCase()) {
      case 'seconds':
        difference = diffMs / 1000;
        unitFormatted = 'วินาที';
        break;
      case 'minutes':
        difference = diffMs / (1000 * 60);
        unitFormatted = 'นาที';
        break;
      case 'hours':
        difference = diffMs / (1000 * 60 * 60);
        unitFormatted = 'ชั่วโมง';
        break;
      case 'days':
      default:
        difference = diffMs / (1000 * 60 * 60 * 24);
        unitFormatted = 'วัน';
        break;
    }
    
    res.json({ 
      difference: Math.round(difference * 100) / 100,
      unit: unitFormatted,
      startDate,
      endDate
    });
  } catch (error: any) {
    console.error('ข้อผิดพลาดในการคำนวณความต่างของวันที่:', error);
    res.status(500).json({ error: `ข้อผิดพลาด: ${error.message}` });
  }
});

// สร้าง MCP Resource
const dateTimeResource: MCPResource = {
  metadata: {
    id: 'datetime',
    name: 'Date and Time',
    description: 'บริการเกี่ยวกับวันที่และเวลา',
    version: '1.0.0',
    tools
  },
  router
};

export default dateTimeResource; 