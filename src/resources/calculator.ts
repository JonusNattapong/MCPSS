import { Router } from 'express';
import { MCPResource, MCPTool } from './types';

const router = Router();

// กำหนดเครื่องมือสำหรับ Calculator Resource
const tools: MCPTool[] = [
  {
    id: 'calculate',
    name: 'Calculate',
    description: 'คำนวณนิพจน์ทางคณิตศาสตร์',
    parameters: [
      {
        name: 'expression',
        description: 'นิพจน์ทางคณิตศาสตร์ (เช่น 2+2*3)',
        type: 'string',
        required: true
      }
    ],
    returns: {
      name: 'result',
      type: 'number',
      description: 'ผลลัพธ์การคำนวณ'
    }
  },
  {
    id: 'convertUnit',
    name: 'Convert Unit',
    description: 'แปลงหน่วย',
    parameters: [
      {
        name: 'value',
        description: 'ค่าที่ต้องการแปลง',
        type: 'number',
        required: true
      },
      {
        name: 'fromUnit',
        description: 'หน่วยต้นทาง (เช่น km, m, cm, kg, g, etc.)',
        type: 'string',
        required: true
      },
      {
        name: 'toUnit',
        description: 'หน่วยปลายทาง (เช่น km, m, cm, kg, g, etc.)',
        type: 'string',
        required: true
      }
    ],
    returns: {
      name: 'result',
      type: 'object',
      description: 'ผลลัพธ์การแปลงหน่วย'
    }
  }
];

// ฟังก์ชันสำหรับประเมินนิพจน์คณิตศาสตร์ (อย่างปลอดภัย)
function evaluateExpression(expression: string): number {
  // กรองอักขระที่อนุญาตเพื่อความปลอดภัย
  const sanitizedExpression = expression.replace(/[^0-9+\-*/().]/g, '');
  
  // ถ้าไม่มีอักขระเหลือหลังการกรอง ให้คืนค่า 0
  if (sanitizedExpression === '') {
    return 0;
  }
  
  try {
    // ใช้ Function constructor (มีความเสี่ยงถ้าไม่กรองข้อมูล)
    // แต่เราได้กรองข้อมูลแล้ว
    return Function(`'use strict'; return (${sanitizedExpression})`)();
  } catch (error) {
    throw new Error(`นิพจน์ไม่ถูกต้อง: ${expression}`);
  }
}

// การแปลงหน่วย
const unitConversions: Record<string, Record<string, number>> = {
  // ความยาว
  'km': { 'm': 1000, 'cm': 100000, 'mm': 1000000, 'mile': 0.621371 },
  'm': { 'km': 0.001, 'cm': 100, 'mm': 1000, 'mile': 0.000621371 },
  'cm': { 'km': 0.00001, 'm': 0.01, 'mm': 10, 'mile': 0.00000621371 },
  'mm': { 'km': 0.000001, 'm': 0.001, 'cm': 0.1, 'mile': 0.000000621371 },
  'mile': { 'km': 1.60934, 'm': 1609.34, 'cm': 160934, 'mm': 1609340 },
  
  // น้ำหนัก
  'kg': { 'g': 1000, 'mg': 1000000, 'lb': 2.20462 },
  'g': { 'kg': 0.001, 'mg': 1000, 'lb': 0.00220462 },
  'mg': { 'kg': 0.000001, 'g': 0.001, 'lb': 0.00000220462 },
  'lb': { 'kg': 0.453592, 'g': 453.592, 'mg': 453592 },
  
  // อุณหภูมิ (การแปลงนี้ต้องใช้สูตรพิเศษ ไม่สามารถใช้ตารางแปลงได้)
};

// ฟังก์ชันแปลงหน่วย
function convertUnit(value: number, fromUnit: string, toUnit: string): number {
  // ถ้าหน่วยเหมือนกัน ส่งค่าเดิมกลับไป
  if (fromUnit === toUnit) {
    return value;
  }
  
  // การแปลงอุณหภูมิ
  if (fromUnit === 'c' && toUnit === 'f') {
    return value * 9/5 + 32;
  } else if (fromUnit === 'f' && toUnit === 'c') {
    return (value - 32) * 5/9;
  } else if (fromUnit === 'c' && toUnit === 'k') {
    return value + 273.15;
  } else if (fromUnit === 'k' && toUnit === 'c') {
    return value - 273.15;
  } else if (fromUnit === 'f' && toUnit === 'k') {
    return (value - 32) * 5/9 + 273.15;
  } else if (fromUnit === 'k' && toUnit === 'f') {
    return (value - 273.15) * 9/5 + 32;
  }
  
  // การแปลงหน่วยอื่นๆ
  if (unitConversions[fromUnit] && unitConversions[fromUnit][toUnit]) {
    return value * unitConversions[fromUnit][toUnit];
  }
  
  throw new Error(`ไม่สามารถแปลงหน่วยจาก ${fromUnit} เป็น ${toUnit} ได้`);
}

// สร้าง endpoint สำหรับคำนวณ
router.post('/calculate', (req, res) => {
  try {
    const { expression } = req.body;
    
    if (!expression) {
      return res.status(400).json({ error: 'กรุณาระบุนิพจน์ทางคณิตศาสตร์' });
    }
    
    const result = evaluateExpression(expression);
    
    res.json({ 
      result, 
      expression,
      formatted: `${expression} = ${result}`
    });
  } catch (error: any) {
    console.error('ข้อผิดพลาดในการคำนวณ:', error);
    res.status(500).json({ error: `ข้อผิดพลาด: ${error.message}` });
  }
});

// สร้าง endpoint สำหรับแปลงหน่วย
router.post('/convert', (req, res) => {
  try {
    const { value, fromUnit, toUnit } = req.body;
    
    if (value === undefined || !fromUnit || !toUnit) {
      return res.status(400).json({ 
        error: 'กรุณาระบุค่า, หน่วยต้นทาง และหน่วยปลายทาง' 
      });
    }
    
    const numericValue = Number(value);
    
    if (isNaN(numericValue)) {
      return res.status(400).json({ error: 'ค่าต้องเป็นตัวเลข' });
    }
    
    const result = convertUnit(numericValue, fromUnit.toLowerCase(), toUnit.toLowerCase());
    
    res.json({
      result,
      original: {
        value: numericValue,
        unit: fromUnit
      },
      converted: {
        value: result,
        unit: toUnit
      },
      formatted: `${numericValue} ${fromUnit} = ${result} ${toUnit}`
    });
  } catch (error: any) {
    console.error('ข้อผิดพลาดในการแปลงหน่วย:', error);
    res.status(500).json({ error: `ข้อผิดพลาด: ${error.message}` });
  }
});

// สร้าง MCP Resource
const calculatorResource: MCPResource = {
  metadata: {
    id: 'calculator',
    name: 'Calculator',
    description: 'บริการคำนวณและแปลงหน่วย',
    version: '1.0.0',
    tools
  },
  router
};

export default calculatorResource; 