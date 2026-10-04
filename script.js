// 1. عداد الزوار باستخدام LocalStorage
let visits = localStorage.getItem('visitor_count') || 124;
visits = parseInt(visits) + 1;
localStorage.setItem('visitor_count', visits);
document.getElementById('visitorCount').innerText = visits;

// 2. الكلمات التعبيرية عن كل لجنة
const quotes = {
    "ديني وثقافي": "✨ 'بالفكر والأخلاق نَبني العقول ونُنير الدرب.'",
    "علمي": "🔬 'بالشغف والتكنولوجيا نبتكر المستقبل.'",
    "فني": "🎨 'بالإبداع واللمسة الفنية نُجمل واقعنا.'",
    "رياضي": "⚽ 'بالعزيمة والروح الرياضية نتصدر القمم.'",
    "اجتماعي": "🤝 'بالتكافل والعطاء نكون يداً واحدة.'"
};

function updateQuote() {
    const select = document.getElementById('committeeSelect');
    const quoteBox = document.getElementById('committeeQuote');
    if (select.value in quotes) {
        quoteBox.innerText = quotes[select.value];
        quoteBox.style.display = 'block';
    }
}

// 3. التنقل بين الخطوات
function nextStep(currentId, nextId) {
    document.getElementById(currentId).style.display = 'none';
    const nextEl = document.getElementById(nextId);
    nextEl.classList.add('active');
    nextEl.style.display = 'block';
}

function validateStep1() {
    const name = document.getElementById('studentName').value.trim();
    const sClass = document.getElementById('studentClass').value.trim();
    const role = document.getElementById('studentRole').value;
    const committee = document.getElementById('committeeSelect').value;

    if (!name || !sClass || !role || !committee) {
        alert('برجاء استكمال كافة البيانات الأساسية قبل الانتقال!');
        return;
    }
    nextStep('step-form1', 'step-form2');
}

// 4. توليد الشهادة وتجميع البيانات
function generateResult() {
    const hobby = document.getElementById('hobby').value.trim();
    const knowledge = document.getElementById('unionKnowledge').value.trim();

    if (!hobby || !knowledge) {
        alert('برجاء الإجابة على جميع الأسئلة!');
        return;
    }

    // تعبئة الشهادة
    document.getElementById('certName').innerText = document.getElementById('studentName').value;
    document.getElementById('certClass').innerText = document.getElementById('studentClass').value;
    document.getElementById('certRole').innerText = document.getElementById('studentRole').value + ' (' + document.getElementById('committeeSelect').value + ')';
    
    const now = new Date();
    document.getElementById('certDate').innerText = now.toLocaleDateString('ar-EG');

    nextStep('step-form2', 'step-result');
}

// 5. إرسال البيانات المنسقة مباشرة لنمرتك على الواتساب
function sendToWhatsApp() {
    const phone = "201229430939"; // رقم الواتساب المباشر
    
    const name = document.getElementById('studentName').value;
    const sClass = document.getElementById('studentClass').value;
    const role = document.getElementById('studentRole').value;
    const committee = document.getElementById('committeeSelect').value;
    const teamRole = document.getElementById('teamRole').value;
    const favActivity = document.getElementById('favActivity').value;
    const hobby = document.getElementById('hobby').value;
    const unionKnowledge = document.getElementById('unionKnowledge').value;
    const leaderRating = document.getElementById('leaderRating').value;

    const message = `*تسجيل قائد جديد - اتحاد الطلاب* 🏆%0A%0A` +
        `👤 *الاسم:* ${name}%0A` +
        `🏫 *الفصل:* ${sClass}%0A` +
        `🏅 *المنصب:* ${role}%0A` +
        `📌 *اللجنة:* ${committee}%0A%0A` +
        `🎯 *الدور المفضل في الفريق:* ${teamRole}%0A` +
        `🚀 *المجال المفضل:* ${favActivity}%0A` +
        `🎨 *الهواية:* ${hobby}%0A` +
        `💡 *معرفته بالاتحاد والمُعرّف:* ${unionKnowledge}%0A` +
        `⭐ *تقييمه للأمين العام (مؤمن القصاص):* ${leaderRating}%0A%0A` +
        `--- تم التسجيل بنجاح عبر موقع القادة ---`;

    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
}
