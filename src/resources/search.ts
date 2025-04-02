import { Router } from 'express';
import { MCPResource, MCPTool } from './types';

const router = Router();

// กำหนดเครื่องมือสำหรับ Search Resource
const tools: MCPTool[] = [
  {
    id: 'searchFiles',
    name: 'Search Files',
    description: 'ค้นหาไฟล์ในระบบ',
    parameters: [
      {
        name: 'query',
        description: 'คำค้นหา',
        type: 'string',
        required: true
      },
      {
        name: 'directory',
        description: 'ไดเรกทอรีที่ต้องการค้นหา',
        type: 'string',
        required: false
      }
    ],
    returns: {
      name: 'results',
      type: 'array',
      description: 'ผลลัพธ์การค้นหาไฟล์'
    }
  },
  {
    id: 'searchFileContent',
    name: 'Search File Content',
    description: 'ค้นหาเนื้อหาในไฟล์',
    parameters: [
      {
        name: 'query',
        description: 'คำค้นหา',
        type: 'string',
        required: true
      },
      {
        name: 'directory',
        description: 'ไดเรกทอรีที่ต้องการค้นหา',
        type: 'string',
        required: false
      },
      {
        name: 'fileType',
        description: 'ประเภทไฟล์ที่ต้องการค้นหา (เช่น js, py, txt)',
        type: 'string',
        required: false
      }
    ],
    returns: {
      name: 'results',
      type: 'array',
      description: 'ผลลัพธ์การค้นหาเนื้อหาในไฟล์'
    }
  }
];

// สร้าง endpoint สำหรับค้นหาไฟล์
router.post('/files', async (req, res) => {
  try {
    const { query, directory } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'กรุณาระบุคำค้นหา' });
    }
    
    // ในเวอร์ชันจริง ควรจะใช้คำสั่งเช่น find, grep, หรือไลบรารีค้นหาไฟล์
    // นี่เป็นเพียงตัวอย่างสำหรับการสาธิต
    const mockResults = [
      {
        name: `example_file_${query}.txt`,
        path: directory ? `${directory}/example_file_${query}.txt` : `/home/user/example_file_${query}.txt`,
        size: '4.2 KB',
        modified: new Date().toISOString()
      },
      {
        name: `another_example_${query}.jpg`,
        path: directory ? `${directory}/another_example_${query}.jpg` : `/home/user/another_example_${query}.jpg`,
        size: '1.5 MB',
        modified: new Date().toISOString()
      }
    ];
    
    res.json({ results: mockResults });
  } catch (error: any) {
    console.error('ข้อผิดพลาดในการค้นหาไฟล์:', error);
    res.status(500).json({ error: `ข้อผิดพลาด: ${error.message}` });
  }
});

// สร้าง endpoint สำหรับค้นหาเนื้อหาในไฟล์
router.post('/content', async (req, res) => {
  try {
    const { query, directory, fileType } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'กรุณาระบุคำค้นหา' });
    }
    
    // ในเวอร์ชันจริง ควรจะใช้คำสั่งเช่น grep, ripgrep, หรือการค้นหาแบบ custom
    // นี่เป็นเพียงตัวอย่างสำหรับการสาธิต
    const mockResults = [
      {
        file: `example${fileType ? ('.' + fileType) : '.txt'}`,
        path: directory ? `${directory}/example${fileType ? ('.' + fileType) : '.txt'}` : `/home/user/example${fileType ? ('.' + fileType) : '.txt'}`,
        line: 42,
        content: `Here is the line containing "${query}" in its content.`,
        context: [
          { line: 41, content: 'The line before the match.' },
          { line: 42, content: `Here is the line containing "${query}" in its content.` },
          { line: 43, content: 'The line after the match.' }
        ]
      },
      {
        file: `another_file${fileType ? ('.' + fileType) : '.txt'}`,
        path: directory ? `${directory}/another_file${fileType ? ('.' + fileType) : '.txt'}` : `/home/user/another_file${fileType ? ('.' + fileType) : '.txt'}`,
        line: 107,
        content: `This line also has "${query}" but in a different context.`,
        context: [
          { line: 106, content: 'Context before the second match.' },
          { line: 107, content: `This line also has "${query}" but in a different context.` },
          { line: 108, content: 'Context after the second match.' }
        ]
      }
    ];
    
    res.json({ results: mockResults });
  } catch (error: any) {
    console.error('ข้อผิดพลาดในการค้นหาเนื้อหาในไฟล์:', error);
    res.status(500).json({ error: `ข้อผิดพลาด: ${error.message}` });
  }
});

// สร้าง MCP Resource
const searchResource: MCPResource = {
  metadata: {
    id: 'search',
    name: 'Search',
    description: 'ค้นหาไฟล์และเนื้อหาในระบบ',
    version: '1.0.0',
    tools
  },
  router
};

export default searchResource; 