import { Router } from 'express';
import { MCPResource, MCPTool } from './types';

const router = Router();

// กำหนดเครื่องมือสำหรับ Web Browsing Resource
const tools: MCPTool[] = [
  {
    id: 'fetchWebPage',
    name: 'Fetch Web Page',
    description: 'ดึงข้อมูลจากเว็บเพจ',
    parameters: [
      {
        name: 'url',
        description: 'URL ของเว็บเพจที่ต้องการดึงข้อมูล',
        type: 'string',
        required: true
      }
    ],
    returns: {
      name: 'content',
      type: 'string',
      description: 'เนื้อหาของเว็บเพจ'
    }
  },
  {
    id: 'searchWeb',
    name: 'Search Web',
    description: 'ค้นหาข้อมูลบนเว็บ',
    parameters: [
      {
        name: 'query',
        description: 'คำค้นหา',
        type: 'string',
        required: true
      }
    ],
    returns: {
      name: 'results',
      type: 'array',
      description: 'ผลลัพธ์การค้นหา'
    }
  }
];

// สร้าง endpoint สำหรับดึงข้อมูลเว็บเพจ
router.post('/fetch', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'กรุณาระบุ URL' });
    }
    
    // ใช้ Node Fetch หรือ library อื่นๆ สำหรับดึงข้อมูลจากเว็บ
    const response = await fetch(url);
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `การดึงข้อมูลล้มเหลว: ${response.statusText}` 
      });
    }
    
    const content = await response.text();
    
    // ส่งข้อมูลกลับ (อาจจะต้องทำความสะอาดหรือแปลงข้อมูลเพิ่มเติม)
    res.json({ content });
  } catch (error: any) {
    console.error('ข้อผิดพลาดในการดึงข้อมูลเว็บเพจ:', error);
    res.status(500).json({ error: `ข้อผิดพลาด: ${error.message}` });
  }
});

// สร้าง endpoint สำหรับค้นหาเว็บ (ตัวอย่างเท่านั้น)
router.post('/search', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'กรุณาระบุคำค้นหา' });
    }
    
    // ตัวอย่างการค้นหา (ในกรณีจริง คุณอาจจะใช้ Google Search API หรือ API อื่นๆ)
    // นี่เป็นเพียงตัวอย่างสำหรับการสาธิต
    const mockResults = [
      {
        title: `ผลการค้นหาสำหรับ "${query}" - ตัวอย่างที่ 1`,
        url: `https://example.com/search?q=${encodeURIComponent(query)}&result=1`,
        snippet: `นี่เป็นตัวอย่างผลลัพธ์การค้นหาสำหรับ "${query}". คลิกลิงก์เพื่อดูข้อมูลเพิ่มเติม.`
      },
      {
        title: `ผลการค้นหาสำหรับ "${query}" - ตัวอย่างที่ 2`,
        url: `https://example.com/search?q=${encodeURIComponent(query)}&result=2`,
        snippet: `ผลลัพธ์การค้นหาอีกรายการสำหรับ "${query}". ข้อมูลนี้เป็นเพียงตัวอย่างเท่านั้น.`
      }
    ];
    
    res.json({ results: mockResults });
  } catch (error: any) {
    console.error('ข้อผิดพลาดในการค้นหาเว็บ:', error);
    res.status(500).json({ error: `ข้อผิดพลาด: ${error.message}` });
  }
});

// สร้าง MCP Resource
const webBrowsingResource: MCPResource = {
  metadata: {
    id: 'webbrowsing',
    name: 'Web Browsing',
    description: 'ค้นหาและดึงข้อมูลจากเว็บ',
    version: '1.0.0',
    tools
  },
  router
};

export default webBrowsingResource; 