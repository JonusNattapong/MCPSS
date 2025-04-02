import { Router } from 'express';
import axios from 'axios';
import { MCPResource, MCPTool, MCPParameter } from './types';
import config from '../config';

// กำหนดเครื่องมือที่รองรับ
const tools: MCPTool[] = [
  {
    id: 'search-web',
    name: 'Search Web',
    description: 'ค้นหาข้อมูลบนเว็บตามคำค้นหา',
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
      description: 'ผลการค้นหาบนเว็บ',
      type: 'array'
    }
  },
  {
    id: 'search-news',
    name: 'Search News',
    description: 'ค้นหาข่าวล่าสุดที่เกี่ยวข้องกับคำค้นหา',
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
      description: 'ผลการค้นหาข่าว',
      type: 'array'
    }
  }
];

// สร้าง Router
const router = Router();

// สร้างข้อมูลจำลองในกรณีที่ไม่มี API key
const getMockSearchResults = (query: string) => {
  return {
    results: [
      {
        title: `ผลการค้นหาจำลองสำหรับ "${query}" - 1`,
        link: 'https://example.com/result1',
        snippet: `นี่คือข้อความตัวอย่างที่เกี่ยวข้องกับ "${query}" เพื่อแสดงให้เห็นว่าการค้นหากำลังทำงาน...`,
      },
      {
        title: `ผลการค้นหาจำลองสำหรับ "${query}" - 2`,
        link: 'https://example.com/result2',
        snippet: `อีกหนึ่งตัวอย่างของข้อมูลเกี่ยวกับ "${query}" ที่คุณอาจสนใจ...`,
      },
      {
        title: `ผลการค้นหาจำลองสำหรับ "${query}" - 3`,
        link: 'https://example.com/result3',
        snippet: `ข้อมูลเพิ่มเติมเกี่ยวกับ "${query}" ที่น่าจะเป็นประโยชน์...`,
      },
    ],
  };
};

const getMockNewsResults = (query: string) => {
  const currentDate = new Date().toISOString().split('T')[0];
  return {
    results: [
      {
        title: `ข่าวล่าสุดเกี่ยวกับ "${query}" - 1`,
        link: 'https://example.com/news1',
        source: 'ตัวอย่างข่าว',
        date: currentDate,
        snippet: `บทความข่าวล่าสุดเกี่ยวกับ "${query}" และผลกระทบ...`,
      },
      {
        title: `ข่าวล่าสุดเกี่ยวกับ "${query}" - 2`,
        link: 'https://example.com/news2',
        source: 'ข่าวตัวอย่าง',
        date: currentDate,
        snippet: `การพัฒนาล่าสุดเกี่ยวกับ "${query}" ในอุตสาหกรรม...`,
      },
      {
        title: `ข่าวล่าสุดเกี่ยวกับ "${query}" - 3`,
        link: 'https://example.com/news3',
        source: 'แหล่งข่าวตัวอย่าง',
        date: currentDate,
        snippet: `ข่าวล่าสุดจากทั่วโลกเกี่ยวกับ "${query}"...`,
      },
    ],
  };
};

// ค้นหาด้วย Serper API
async function searchWithSerper(query: string, type: 'search' | 'news' = 'search') {
  try {
    if (!config.apiKeys.serper) {
      throw new Error('ไม่มี Serper API key');
    }

    const endpoint = 'https://google.serper.dev/search';
    const response = await axios.post(
      endpoint,
      {
        q: query,
        ...(type === 'news' ? { type: 'news' } : {}),
      },
      {
        headers: {
          'X-API-KEY': config.apiKeys.serper,
          'Content-Type': 'application/json',
        },
      }
    );

    if (type === 'search') {
      const organicResults = response.data.organic || [];
      return {
        results: organicResults.map((result: any) => ({
          title: result.title,
          link: result.link,
          snippet: result.snippet,
        })),
      };
    } else {
      const newsResults = response.data.news || [];
      return {
        results: newsResults.map((result: any) => ({
          title: result.title,
          link: result.link,
          source: result.source,
          date: result.date,
          snippet: result.snippet || result.description || '',
        })),
      };
    }
  } catch (error) {
    console.error('Serper search error:', error);
    throw error;
  }
}

// ค้นหาด้วย Bing API
async function searchWithBing(query: string, type: 'search' | 'news' = 'search') {
  try {
    if (!config.apiKeys.bing) {
      throw new Error('ไม่มี Bing API key');
    }

    const endpoint = type === 'news'
      ? `https://api.bing.microsoft.com/v7.0/news/search?q=${encodeURIComponent(query)}`
      : `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(query)}`;

    const response = await axios.get(endpoint, {
      headers: {
        'Ocp-Apim-Subscription-Key': config.apiKeys.bing,
      },
    });

    if (type === 'search') {
      const webPages = response.data.webPages?.value || [];
      return {
        results: webPages.map((page: any) => ({
          title: page.name,
          link: page.url,
          snippet: page.snippet,
        })),
      };
    } else {
      const newsItems = response.data.value || [];
      return {
        results: newsItems.map((item: any) => ({
          title: item.name,
          link: item.url,
          source: item.provider?.[0]?.name || 'Unknown',
          date: item.datePublished || new Date().toISOString(),
          snippet: item.description || '',
        })),
      };
    }
  } catch (error) {
    console.error('Bing search error:', error);
    throw error;
  }
}

// เส้นทางสำหรับการค้นหาทั่วไป
router.post('/search', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'ต้องระบุคำค้นหา (query)' });
    }

    console.log(`กำลังค้นหาเว็บสำหรับ: ${query}`);

    // ลองใช้ API ที่กำหนดค่าไว้ หรือกลับไปใช้ข้อมูลจำลอง
    try {
      if (config.apiKeys.serper) {
        const results = await searchWithSerper(query);
        return res.json(results);
      } else if (config.apiKeys.bing) {
        const results = await searchWithBing(query);
        return res.json(results);
      }
    } catch (apiError) {
      console.warn('ไม่สามารถใช้ API ค้นหาได้, ใช้ข้อมูลจำลองแทน:', apiError);
    }

    // ถ้าไม่มี API key หรือการค้นหาล้มเหลว ให้ใช้ข้อมูลจำลอง
    const mockResults = getMockSearchResults(query);
    res.json(mockResults);
  } catch (error) {
    console.error('Web search error:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการค้นหา' });
  }
});

// เส้นทางสำหรับการค้นหาข่าว
router.post('/news', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'ต้องระบุคำค้นหา (query)' });
    }

    console.log(`กำลังค้นหาข่าวสำหรับ: ${query}`);

    // ลองใช้ API ที่กำหนดค่าไว้ หรือกลับไปใช้ข้อมูลจำลอง
    try {
      if (config.apiKeys.serper) {
        const results = await searchWithSerper(query, 'news');
        return res.json(results);
      } else if (config.apiKeys.bing) {
        const results = await searchWithBing(query, 'news');
        return res.json(results);
      }
    } catch (apiError) {
      console.warn('ไม่สามารถใช้ API ค้นหาข่าวได้, ใช้ข้อมูลจำลองแทน:', apiError);
    }

    // ถ้าไม่มี API key หรือการค้นหาล้มเหลว ให้ใช้ข้อมูลจำลอง
    const mockResults = getMockNewsResults(query);
    res.json(mockResults);
  } catch (error) {
    console.error('News search error:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการค้นหาข่าว' });
  }
});

// สร้าง MCPResource
const websearchResource: MCPResource = {
  metadata: {
    id: 'websearch',
    name: 'Web Search',
    description: 'ค้นหาข้อมูลบนเว็บและข่าวล่าสุด',
    version: '1.0.0',
    tools,
  },
  router,
};

export default websearchResource; 