// وظيفة فتح وإغلاق نافذة المطور
function toggleModal() {
    const modal = document.getElementById('devModal');
    modal.style.display = (modal.style.display === 'block') ? 'none' : 'block';
}

// إغلاق النافذة عند الضغط خارجها
window.onclick = function(event) {
    const modal = document.getElementById('devModal');
    if (event.target == modal) modal.style.display = "none";
}

document.getElementById('searchBtn').addEventListener('click', async () => {
    const query = document.getElementById('userInput').value;
    const loader = document.getElementById('loader');
    const result = document.getElementById('resultContainer');

    if (!query) return;

    // حالة البحث
    loader.style.display = 'block';
    result.classList.add('hidden');

    try {
        // الاتصال بالسيرفر الخاص بك على Vercel
        const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
        const data = await response.json();

        if(data.error) throw new Error();

        // تعبئة البيانات
        document.getElementById('thumb').src = data.thumbnail;
        document.getElementById('videoTitle').innerText = data.title;
        document.getElementById('videoAuthor').innerHTML = `<i class="fas fa-user"></i> ${data.author}`;
        document.getElementById('videoDuration').innerHTML = `<i class="fas fa-clock"></i> ${data.duration}`;

        loader.style.display = 'none';
        result.classList.remove('hidden');

    } catch (error) {
        loader.style.display = 'none';
        alert("عذراً، لم أستطع العثور على ما تبحث عنه.");
    }
});
