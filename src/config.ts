import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// โหลดไฟล์ .env ถ้ามี
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.warn('ไม่พบไฟล์ .env กรุณาคัดลอกจาก .env.example และตั้งค่า API key');
  // คัดลอกไฟล์ .env.example เป็น .env ถ้ายังไม่มี
  const exampleEnvPath = path.resolve(process.cwd(), '.env.example');
  if (fs.existsSync(exampleEnvPath)) {
    fs.copyFileSync(exampleEnvPath, envPath);
    console.info('สร้างไฟล์ .env จาก .env.example แล้ว กรุณาแก้ไขไฟล์นี้และเพิ่ม API key');
  }
}

// ตรวจสอบว่ามี API key หรือไม่
const config = {
  apiKeys: {
    anthropic: process.env.ANTHROPIC_API_KEY || '',
    openai: process.env.OPENAI_API_KEY || '',
    openweather: process.env.OPENWEATHER_API_KEY || '',
    ipgeolocation: process.env.IPGEOLOCATION_API_KEY || '',
    serper: process.env.SERPER_API_KEY || '',
    bing: process.env.BING_SEARCH_API_KEY || '',
  },
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || 'localhost',
  },
  features: {
    fileSystem: process.env.ENABLE_FILE_SYSTEM !== 'false',
    webBrowsing: process.env.ENABLE_WEB_BROWSING !== 'false',
    codeExecution: process.env.ENABLE_CODE_EXECUTION !== 'false',
    search: process.env.ENABLE_SEARCH !== 'false',
    datetime: process.env.ENABLE_DATETIME !== 'false',
    location: process.env.ENABLE_LOCATION !== 'false',
    calculator: process.env.ENABLE_CALCULATOR !== 'false',
    websearch: process.env.ENABLE_WEBSEARCH !== 'false',
  },
  validateConfig: (): {isValid: boolean, message: string} => {
    if (!config.apiKeys.anthropic && !config.apiKeys.openai) {
      return {
        isValid: false,
        message: 'กรุณาตั้งค่า ANTHROPIC_API_KEY หรือ OPENAI_API_KEY ในไฟล์ .env'
      };
    }
    return { isValid: true, message: 'การตั้งค่าถูกต้อง' };
  }
};

export default config; 