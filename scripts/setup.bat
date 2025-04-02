@echo off
echo ====================================
echo    MCP Smart Server - การติดตั้ง
echo ====================================
echo.

REM ตรวจสอบว่ามี Node.js หรือไม่
node --version > nul 2>&1
if %errorlevel% neq 0 (
    echo ไม่พบ Node.js! กรุณาติดตั้ง Node.js ก่อนดำเนินการต่อ
    echo ดาวน์โหลดได้ที่: https://nodejs.org/
    exit /b 1
)

echo ติดตั้งแพ็คเกจที่จำเป็น...
call npm install
if %errorlevel% neq 0 (
    echo การติดตั้งแพ็คเกจล้มเหลว!
    exit /b 1
)

echo.
echo สร้างไฟล์ .env สำหรับตั้งค่า API key...

if not exist .env (
    copy .env.example .env
    echo สร้างไฟล์ .env จาก .env.example แล้ว
) else (
    echo ไฟล์ .env มีอยู่แล้ว ข้ามการสร้าง
)

echo.
echo สร้างโฟลเดอร์ชั่วคราว...
if not exist temp mkdir temp

echo.
echo กำลังสร้าง...
call npm run build
if %errorlevel% neq 0 (
    echo การสร้างล้มเหลว!
    exit /b 1
)

echo.
echo ====================================
echo การติดตั้งเสร็จสมบูรณ์!
echo.
echo กรุณาแก้ไขไฟล์ .env เพื่อใส่ API key ของคุณ
echo จากนั้นรันคำสั่ง "npm start" เพื่อเริ่มใช้งาน MCP Smart Server
echo ==================================== 