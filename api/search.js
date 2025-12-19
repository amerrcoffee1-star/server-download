// api/search.js
const yts = require('yt-search');

export default async function handler(req, res) {
    // إعدادات السماح بالوصول (CORS) لضمان عمل السيرفر مع الواجهة
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // التعامل مع طلبات Preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { query } = req.query;

    // التأكد من وجود نص للبحث
    if (!query) {
        return res.status(400).json({ error: 'يرجى إدخال اسم الأغنية أو الرابط' });
    }

    try {
        // تنفيذ البحث لجلب النتائج الرائجة (أول 6 نتائج)
        const searchResult = await yts(query);
        const videos = searchResult.videos.slice(0, 6);

        if (videos.length === 0) {
            return res.status(404).json({ error: 'لم يتم العثور على نتائج بحث' });
        }

        // تنقية البيانات وإرسالها للواجهة الأمامية
        const results = videos.map(v => ({
            title: v.title,
            author: v.author.name,
            thumbnail: v.thumbnail,
            url: v.url,
            duration: v.timestamp,
            views: v.views.toLocaleString(),
            ago: v.ago
        }));

        return res.status(200).json({ results });

    } catch (error) {
        console.error('Search API Error:', error);
        return res.status(500).json({ error: 'فشل السيرفر في جلب نتائج البحث' });
    }
}
