// استيراد مكتبة البحث (يجب تنصيبها عبر npm install yt-search)
const yts = require('yt-search');

export default async function handler(req, res) {
    // السماح بالطلبات من المتصفح (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'لم يتم إرسال اسم للبحث عنه' });
    }

    try {
        // تنفيذ عملية البحث باستخدام المكتبة
        const r = await yts(query);
        const video = r.videos[0]; // جلب أول نتيجة بحث

        if (!video) {
            return res.status(404).json({ error: 'لا توجد نتائج' });
        }

        // إرجاع البيانات المنظمة للواجهة الأمامية
        return res.status(200).json({
            title: video.title,
            author: video.author.name,
            thumbnail: video.thumbnail,
            url: video.url,
            duration: video.timestamp,
            views: video.views,
            description: video.description
        });

    } catch (error) {
        console.error('Search Error:', error);
        return res.status(500).json({ error: 'حدث خطأ داخلي في السيرفر' });
    }
}
