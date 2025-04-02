#!/bin/bash

echo "===================================="
echo "   MCP Smart Server - การติดตั้ง"
echo "===================================="
echo

# ตรวจสอบว่ามี Node.js หรือไม่
if ! command -v node &> /dev/null; then
    echo "ไม่พบ Node.js! กรุณาติดตั้ง Node.js ก่อนดำเนินการต่อ"
    echo "ดาวน์โหลดได้ที่: https://nodejs.org/"
    exit 1
fi

echo "ติดตั้งแพ็คเกจที่จำเป็น..."
npm install
if [ $? -ne 0 ]; then
    echo "การติดตั้งแพ็คเกจล้มเหลว!"
    exit 1
fi

echo
echo "สร้างไฟล์ .env สำหรับตั้งค่า API key..."

if [ ! -f .env ]; then
    cp .env.example .env
    echo "สร้างไฟล์ .env จาก .env.example แล้ว"
else
    echo "ไฟล์ .env มีอยู่แล้ว ข้ามการสร้าง"
fi

echo
echo "สร้างโฟลเดอร์ชั่วคราว..."
mkdir -p temp

echo
echo "กำลังสร้าง..."
npm run build
if [ $? -ne 0 ]; then
    echo "การสร้างล้มเหลว!"
    exit 1
fi

echo
echo "===================================="
echo "การติดตั้งเสร็จสมบูรณ์!"
echo
echo "กรุณาแก้ไขไฟล์ .env เพื่อใส่ API key ของคุณ"
echo "จากนั้นรันคำสั่ง \"npm start\" เพื่อเริ่มใช้งาน MCP Smart Server"
echo "====================================" 