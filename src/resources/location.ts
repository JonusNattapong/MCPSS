import { Router } from 'express';
import { MCPResource, MCPTool } from './types';

const router = Router();

// กำหนดเครื่องมือสำหรับ Location Resource
const tools: MCPTool[] = [
  {
    id: 'getLocation',
    name: 'Get Location',
    description: 'รับข้อมูลตำแหน่งปัจจุบันจาก IP',
    parameters: [],
    returns: {
      name: 'location',
      type: 'object',
      description: 'ข้อมูลตำแหน่งปัจจุบัน'
    }
  },
  {
    id: 'getWeather',
    name: 'Get Weather',
    description: 'รับข้อมูลสภาพอากาศจากตำแหน่ง',
    parameters: [
      {
        name: 'city',
        description: 'ชื่อเมือง',
        type: 'string',
        required: false
      },
      {
        name: 'country',
        description: 'ชื่อประเทศ',
        type: 'string',
        required: false
      }
    ],
    returns: {
      name: 'weather',
      type: 'object',
      description: 'ข้อมูลสภาพอากาศ'
    }
  }
];

// สร้าง endpoint สำหรับข้อมูลตำแหน่ง
router.post('/whereami', async (req, res) => {
  try {
    // ในสถานการณ์จริงจะต้องเรียก API เพื่อรับตำแหน่ง IP
    // แต่ในตัวอย่างนี้เราจะจำลองข้อมูล
    
    // สมมติว่าเราได้รับข้อมูล IP จากผู้ใช้
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    
    // จำลองข้อมูลตำแหน่ง
    const locationData = {
      ip: Array.isArray(clientIp) ? clientIp[0] : clientIp,
      city: 'กรุงเทพมหานคร',
      region: 'กรุงเทพมหานคร',
      country: 'ประเทศไทย',
      country_code: 'TH',
      continent: 'เอเชีย',
      latitude: 13.7563,
      longitude: 100.5018,
      timezone: 'Asia/Bangkok',
      currency: 'THB',
      languages: ['th', 'en'],
      isp: 'True Internet',
      approximate: true,
      fetched_at: new Date().toISOString()
    };
    
    res.json({ location: locationData });
  } catch (error: any) {
    console.error('ข้อผิดพลาดในการดึงข้อมูลตำแหน่ง:', error);
    res.status(500).json({ error: `ข้อผิดพลาด: ${error.message}` });
  }
});

// สร้าง endpoint สำหรับข้อมูลสภาพอากาศ
router.post('/weather', async (req, res) => {
  try {
    const { city = 'กรุงเทพมหานคร', country = 'ประเทศไทย' } = req.body;
    
    // ในสถานการณ์จริงควรเรียกใช้ API สภาพอากาศ เช่น OpenWeatherMap
    // แต่ในตัวอย่างนี้เราจะจำลองข้อมูล
    
    // จำลองสภาพอากาศสำหรับกรุงเทพฯ
    const weatherData = {
      location: {
        city,
        country,
        coordinates: {
          latitude: 13.7563,
          longitude: 100.5018
        }
      },
      current: {
        temperature: 32,
        temperature_unit: 'celsius',
        weather_condition: 'แดดจัด',
        humidity: 75,
        wind_speed: 10,
        wind_speed_unit: 'km/h',
        pressure: 1010,
        pressure_unit: 'hPa',
        uv_index: 10
      },
      forecast: [
        {
          date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          condition: 'เมฆบางส่วน',
          high_temperature: 33,
          low_temperature: 26
        },
        {
          date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
          condition: 'ฝนตกเล็กน้อย',
          high_temperature: 31,
          low_temperature: 25
        },
        {
          date: new Date(Date.now() + 259200000).toISOString().split('T')[0],
          condition: 'ฝนตกปานกลาง',
          high_temperature: 30,
          low_temperature: 24
        }
      ],
      fetched_at: new Date().toISOString()
    };
    
    res.json({ weather: weatherData });
  } catch (error: any) {
    console.error('ข้อผิดพลาดในการดึงข้อมูลสภาพอากาศ:', error);
    res.status(500).json({ error: `ข้อผิดพลาด: ${error.message}` });
  }
});

// สร้าง MCP Resource
const locationResource: MCPResource = {
  metadata: {
    id: 'location',
    name: 'Location and Weather',
    description: 'บริการเกี่ยวกับตำแหน่งและสภาพอากาศ',
    version: '1.0.0',
    tools
  },
  router
};

export default locationResource; 