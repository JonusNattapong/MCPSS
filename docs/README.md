# เอกสาร MCPSS (MCP Smart Server)

## ภาพรวม

MCPSS คือ MCP Server ที่ง่ายต่อการติดตั้งและใช้งาน สามารถเชื่อมต่อกับโมเดล AI ได้โดยการใช้ Model Context Protocol (MCP)

## การตั้งค่า API Key

1. เปิดไฟล์ `.env` ในโฟลเดอร์หลักของโปรเจค 
2. ใส่ API key ของคุณ:
   ```
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   ```

## ทรัพยากรที่มีให้บริการ

MCPSS ประกอบด้วยทรัพยากร (resources) ต่อไปนี้:

### 1. File System

เข้าถึงไฟล์และไดเรกทอรีในเครื่อง:

- **List Directory**: แสดงรายการไฟล์และโฟลเดอร์ในไดเรกทอรี
- **Read File**: อ่านเนื้อหาของไฟล์

### 2. Web Browsing

เรียกดูและค้นหาข้อมูลบนเว็บ:

- **Fetch Web Page**: ดึงข้อมูลจากเว็บเพจ
- **Search Web**: ค้นหาข้อมูลบนเว็บ

### 3. Code Execution

รันโค้ดในภาษาต่างๆ:

- **Execute Code**: รันโค้ดในภาษา Python, JavaScript หรือ Bash

### 4. Search

ค้นหาไฟล์และเนื้อหาในระบบ:

- **Search Files**: ค้นหาไฟล์ในระบบ
- **Search File Content**: ค้นหาเนื้อหาในไฟล์

### 5. Date and Time

บริการเกี่ยวกับวันที่และเวลา:

- **Get Current Time**: ดึงเวลาปัจจุบันในรูปแบบต่างๆ และโซนเวลาต่างๆ
- **Get Date Difference**: คำนวณระยะเวลาระหว่างวันที่

### 6. Location and Weather

บริการเกี่ยวกับตำแหน่งและสภาพอากาศ:

- **Get Location**: รับข้อมูลตำแหน่งปัจจุบันจาก IP
- **Get Weather**: รับข้อมูลสภาพอากาศจากตำแหน่ง

### 7. Calculator

บริการคำนวณและแปลงหน่วย:

- **Calculate**: คำนวณนิพจน์ทางคณิตศาสตร์
- **Convert Unit**: แปลงหน่วยวัดต่างๆ (ความยาว, น้ำหนัก, อุณหภูมิ)

## การใช้งานกับ AI Clients

1. เริ่ม MCPSS โดยรันคำสั่ง `npm start`
2. เปิด AI client ที่รองรับ MCP เช่น Claude Desktop
3. ตั้งค่าการเชื่อมต่อกับ MCP server: `http://localhost:3000`

## การเปิด/ปิด Resources

คุณสามารถควบคุมการเปิด/ปิด resources ได้ในไฟล์ `.env` โดยการตั้งค่า:

```
ENABLE_FILE_SYSTEM=true
ENABLE_WEB_BROWSING=true
ENABLE_CODE_EXECUTION=true
ENABLE_SEARCH=true
ENABLE_DATETIME=true
ENABLE_LOCATION=true
ENABLE_CALCULATOR=true
```

## วิธีแก้ปัญหาเบื้องต้น

### ปัญหา: เชื่อมต่อกับ MCPSS ไม่ได้

1. ตรวจสอบว่า MCPSS กำลังทำงานอยู่
2. ตรวจสอบว่าพอร์ตที่ใช้ (3000) ไม่ถูกใช้งานโดยแอปอื่น
3. ลองเปิดเบราว์เซอร์ไปที่ `http://localhost:3000/health` เพื่อตรวจสอบสถานะ

### ปัญหา: API key ไม่ทำงาน

1. ตรวจสอบว่าคุณได้ใส่ API key ถูกต้องในไฟล์ `.env`
2. ตรวจสอบว่า API key ยังใช้งานได้
3. รีสตาร์ท MCPSS หลังจากอัปเดต API key 