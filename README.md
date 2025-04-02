# MCPSS - Model Context Protocol Smart Server

MCP Smart Server เป็นเซิร์ฟเวอร์ที่เชื่อมต่อระหว่างโมเดล AI กับแหล่งข้อมูลต่างๆ ผ่าน Model Context Protocol (MCP)

## รายละเอียด
MCPSS (MCP Smart Server) คือระบบที่ช่วยให้ AI models เชื่อมต่อกับข้อมูลและเครื่องมือต่างๆ ได้อย่างง่ายดาย โดยการใช้ [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)

## คุณสมบัติ
- ⚡ **ติดตั้งง่าย**: ทำงานด้วยคำสั่งเดียว
- 🔑 **ตั้งค่าง่าย**: เพียงใส่ API key และเริ่มใช้งานได้ทันที
- 🛠️ **ครบครัน**: รวม MCP servers หลายตัวเข้าด้วยกัน
- 💻 **ทำงานแบบ local**: ทำงานบนเครื่องของคุณเพื่อความปลอดภัย

## Resources ที่มีให้บริการ

MCPSS มีความสามารถหลากหลายผ่าน Resources ต่างๆ ดังนี้:

* **File System**: เข้าถึงไฟล์และโฟลเดอร์บนคอมพิวเตอร์
* **Web Browsing**: ท่องเว็บและค้นหาข้อมูลบนอินเทอร์เน็ต
* **Code Execution**: รันโค้ด Python, JavaScript และ Bash
* **Search**: ค้นหาไฟล์และเนื้อหาในระบบ
* **Date & Time**: บริการเกี่ยวกับวันที่และเวลา
* **Location & Weather**: บริการเกี่ยวกับตำแหน่งและข้อมูลสภาพอากาศ
* **Calculator**: บริการคำนวณและแปลงหน่วย
* **Web Search**: ค้นหาข้อมูลบนเว็บและข่าวสารล่าสุดด้วย API ที่ทันสมัย

## การติดตั้ง

### Linux/Mac
```bash
git clone https://github.com/yourusername/mcpss.git
cd mcpss
npm install
cp .env.example .env
# แก้ไข .env ตามความเหมาะสม
npm run dev
```

### Windows
```powershell
git clone https://github.com/yourusername/mcpss.git
cd mcpss
npm install
copy .env.example .env
# แก้ไข .env ตามความเหมาะสม
npm run dev
```

## การตั้งค่า

คุณสามารถเปิดหรือปิดฟีเจอร์ต่างๆ ได้ในไฟล์ `.env`:

```
# API Keys
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Server settings
PORT=3000
HOST=localhost

# Feature flags (true/false)
ENABLE_FILESYSTEM=true
ENABLE_WEB_BROWSING=true
ENABLE_CODE_EXECUTION=true
ENABLE_SEARCH=true
ENABLE_DATETIME=true
ENABLE_LOCATION=true
ENABLE_CALCULATOR=true
ENABLE_WEBSEARCH=true

# API keys for specific features (optional)
# OPENWEATHER_API_KEY=your_openweather_api_key_here
# IP_GEOLOCATION_API_KEY=your_ip_geolocation_api_key_here
# SERPER_API_KEY=your_serper_api_key_here
# BING_SEARCH_API_KEY=your_bing_search_api_key_here
```

## การใช้งาน Web Search

MCPSS มีความสามารถในการค้นหาข้อมูลบนเว็บผ่าน:

1. **ค้นหาทั่วไป**: ค้นหาข้อมูลบนเว็บตามคำค้นหา
   - Endpoint: `http://localhost:3000/mcp/websearch/search`
   - Parameters: `query` (คำค้นหา)

2. **ค้นหาข่าว**: ค้นหาข่าวล่าสุดที่เกี่ยวข้องกับคำค้นหา
   - Endpoint: `http://localhost:3000/mcp/websearch/news`
   - Parameters: `query` (คำค้นหา)

API ที่รองรับ:
- Serper API (ต้องมี SERPER_API_KEY ใน .env)
- Bing Search API (ต้องมี BING_SEARCH_API_KEY ใน .env)

ถ้าไม่มี API key จะใช้ผลลัพธ์จำลองแทน

## การใช้งาน
1. ใส่ API key ในไฟล์ `.env`
2. รันคำสั่ง: `npm start`
3. เชื่อมต่อกับ AI client ที่รองรับ MCP (เช่น Claude Desktop)

## เอกสาร
ดูเอกสารเพิ่มเติมได้ที่ [docs/README.md](docs/README.md)
