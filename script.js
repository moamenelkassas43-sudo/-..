const WHATSAPP_NUMBER = "201229430939";
let currentStep = 1;
const totalSteps = 7;
let rating = 0;

// دالة بدء التسجيل
function startRegistration() {
    const section = document.getElementById("register") || document.getElementById("registration");
    if (section) {
        section.classList.remove("hidden");
        section.scrollIntoView({ behavior: "smooth" });
        updateStep();
    }
}

// دالة الخطوة التالية
function nextStep() {
    if (!validateCurrentStep()) return;
    if (currentStep < totalSteps) {
        currentStep++;
        updateStep();
    }
}

// دالة الخطوة السابقة
function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStep();
    }
}

// تحديث واجهة الخطوة الحالية
function updateStep() {
    document.querySelectorAll(".step").forEach(s => s.classList.remove("active", "active-step"));
    const active = document.querySelector(`.step[data-step="${currentStep}"]`);
    if (active) active.classList.add("active", "active-step");

    // تحديث شريط التقدم والعداد
    const progressBar = document.getElementById("progressBar") || document.getElementById("progress");
    if (progressBar) progressBar.style.width = (currentStep / totalSteps) * 100 + "%";

    const stepNumber = document.getElementById("stepNumber") || document.getElementById("stepNo");
    if (stepNumber) stepNumber.textContent = String(currentStep).padStart(2, "0");

    const titles = {
        1: "خلينا نتعرف عليك 👋🏻",
        2: "اختار مكانك في الاتحاد 🎯",
        3: "أنت شاطر في إيه؟ 🚀",
        4: "بتحب تنفذ أنشطة فين؟ 🔥",
        5: "عرفنا أكتر عنك ✨",
        6: "رأيك يهمنا ⭐",
        7: "آخر خطوة... جاهز؟ 🚀"
    };

    const stepTitle = document.getElementById("stepTitle");
    if (stepTitle) stepTitle.textContent = titles[currentStep];

    const prevBtn = document.getElementById("prevBtn") || document.getElementById("backBtn");
    if (prevBtn) prevBtn.style.visibility = currentStep === 1 ? "hidden" : "visible";

    const nextBtn = document.getElementById("nextBtn");
    if (nextBtn) nextBtn.style.display = currentStep === totalSteps ? "none" : "inline-flex";

    if (currentStep === 7) createReview();
}

// التحقق من الحقول الإجباري
function validateCurrentStep() {
    if (currentStep === 1) {
        const name = document.getElementById("name")?.value.trim();
        const grade = document.getElementById("grade")?.value.trim();
        const classroom = document.getElementById("classroom")?.value.trim();
        const position = document.querySelector('input[name="position"]:checked');
        if (!name || !grade || !classroom || !position) {
            showAlert("من فضلك أكمل الاسم والصف والفصل واختار منصبك.");
            return false;
        }
    }
    if (currentStep === 2 && !document.querySelectorAll('input[name="committee"]:checked').length) {
        showAlert("اختار لجنة واحدة على الأقل.");
        return false;
    }
    if (currentStep === 3 && !document.querySelectorAll('input[name="skills"]:checked').length) {
        showAlert("اختار مهارة واحدة على الأقل.");
        return false;
    }
    if (currentStep === 6 && !rating) {
        showAlert("من فضلك اختر تقييمك.");
        return false;
    }
    return true;
}

function showAlert(message) {
    alert(message);
}

// جلب قيم الاختيارات المتعددة
function getChecked(name) {
    return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(x => x.value);
}

// حماية الكود من HTML Injection
function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

// ملخص البيانات قبل الإرسال
function createReview() {
    const name = document.getElementById("name")?.value || "";
    const grade = document.getElementById("grade")?.value || "";
    const classroom = document.getElementById("classroom")?.value || "";
    const position = document.querySelector('input[name="position"]:checked')?.value || "غير محدد";
    const committees = getChecked("committee");
    const skills = getChecked("skills");
    const activities = getChecked("activities");
    const hobbies = document.getElementById("hobbies")?.value || "";
    const introducedBy = document.getElementById("introducedBy")?.value || "";

    const reviewElem = document.getElementById("review");
    if (reviewElem) {
        reviewElem.innerHTML = `
            <div class="review-row"><span>الاسم</span><strong>${escapeHTML(name)}</strong></div>
            <div class="review-row"><span>الصف</span><strong>${escapeHTML(grade)}</strong></div>
            <div class="review-row"><span>الفصل</span><strong>${escapeHTML(classroom)}</strong></div>
            <div class="review-row"><span>المنصب</span><strong>${escapeHTML(position)}</strong></div>
            <div class="review-row"><span>اللجان</span><strong>${escapeHTML(committees.join("، "))}</strong></div>
            <div class="review-row"><span>المهارات</span><strong>${escapeHTML(skills.join("، "))}</strong></div>
            <div class="review-row"><span>الأنشطة</span><strong>${escapeHTML(activities.join("، ") || "لم يحدد")}</strong></div>
            <div class="review-row"><span>الهوايات</span><strong>${escapeHTML(hobbies) || "لم يحدد"}</strong></div>
            <div class="review-row"><span>عرف الاتحاد عن طريق</span><strong>${escapeHTML(introducedBy) || "لم يحدد"}</strong></div>`;
    }
}

// تشغيل الأحداث بعد تحويل الـ DOM
document.addEventListener("DOMContentLoaded", () => {
    // 1. زر ابدأ الرحلة
    const startBtn = document.querySelector("[data-start]");
    if (startBtn) {
        startBtn.addEventListener("click", startRegistration);
    }

    // 2. أزرار التالي والسابق
    const nextBtn = document.getElementById("nextBtn");
    if (nextBtn) nextBtn.addEventListener("click", nextStep);

    const prevBtn = document.getElementById("prevBtn") || document.getElementById("backBtn");
    if (prevBtn) prevBtn.addEventListener("click", previousStep);

    // 3. نظام التقييم بالنجوم
    const ratingButtons = document.querySelectorAll("#rating button, #stars button");
    ratingButtons.forEach(button => {
        button.addEventListener("click", () => {
            rating = Number(button.dataset.value || button.dataset.rate || 0);
            ratingButtons.forEach(star => {
                const starVal = Number(star.dataset.value || star.dataset.rate || 0);
                star.classList.toggle("active", starVal <= rating);
            });
        });
    });

    // 4. إرسال النموذج لـ WhatsApp
    const form = document.getElementById("registrationForm") || document.getElementById("unionForm");
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            const name = document.getElementById("name").value.trim();
            const grade = document.getElementById("grade").value.trim();
            const classroom = document.getElementById("classroom").value.trim();
            const phone = document.getElementById("phone")?.value.trim() || "";
            const email = document.getElementById("email")?.value.trim() || "";
            const position = document.querySelector('input[name="position"]:checked')?.value || "";
            const committees = getChecked("committee");
            const skills = getChecked("skills");
            const activities = getChecked("activities");
            const hobbies = document.getElementById("hobbies")?.value.trim() || "";
            const unionKnowledge = document.getElementById("unionKnowledge")?.value.trim() || "";
            const introducedBy = document.getElementById("introducedBy")?.value.trim() || "";
            const message = document.getElementById("message")?.value.trim() || "";
            const date = new Date().toLocaleString("ar-EG");

            const whatsappMessage = `🚀 *تسجيل جديد — اتحاد طلاب المدرسة*
👤 *الاسم:* ${name}
🎓 *الصف:* ${grade}
🏫 *الفصل:* ${classroom}
🏅 *المنصب:* ${position}
📚 *اللجان:* ${committees.join("، ")}
🎯 *المهارات:* ${skills.join("، ")}
🔥 *مجالات الأنشطة:* ${activities.join("، ") || "لم يحدد"}
🎨 *الهوايات:* ${hobbies || "لم يحدد"}
📖 *معرفته بالاتحاد:* ${unionKnowledge || "لم يحدد"}
👥 *عرف الاتحاد عن طريق:* ${introducedBy || "لم يحدد"}
⭐ *التقييم:* ${rating}/5
💬 *الكلمة أو الاقتراح:* ${message || "لا يوجد"}
📞 *الهاتف:* ${phone || "لم يحدد"}
📧 *البريد:* ${email || "لم يحدد"}
🕐 *وقت التسجيل:* ${date}
━━━━━━━━━━━━━━
*منصة اتحاد طلاب المدرسة*
*المؤسس: مؤمن القصاص*`;

            const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(url, "_blank");

            const regSection = document.getElementById("register") || document.getElementById("registration");
            if (regSection) regSection.classList.add("hidden");

            const successSection = document.getElementById("success");
            if (successSection) {
                successSection.classList.remove("hidden");
                const certName = document.getElementById("certificateName") || document.getElementById("successName");
                if (certName) certName.textContent = `أهلًا بيك يا قائد، ${name}`;

                const certStudent = document.getElementById("certificateStudent") || document.getElementById("certificateName");
                if (certStudent) certStudent.textContent = name;

                successSection.scrollIntoView({ behavior: "smooth" });
            }
        });
    }

    // 5. عداد الزوار
    let visitors = Number(localStorage.getItem("unionVisitors") || 128);
    visitors++;
    localStorage.setItem("unionVisitors", visitors);
    const visitorCount = document.getElementById("visitorCount");
    if (visitorCount) visitorCount.textContent = visitors.toLocaleString("en-US");

    // 6. التبديل بين المظهر الفاتح والداكن (Theme Toggle)
    const themeBtn = document.getElementById("themeBtn") || document.getElementById("themeToggle");
    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            document.body.classList.toggle("light-mode");
            document.body.classList.toggle("light");
            const icon = document.querySelector("#themeBtn svg");
            if (icon) icon.setAttribute("data-lucide", document.body.classList.contains("light-mode") ? "sun" : "moon");
            if (window.lucide) lucide.createIcons();
        });
    }

    if (window.lucide) lucide.createIcons();
});
