/* =========================================================
   STUDENT UNION REGISTRATION SYSTEM - JS SCRIPT
   ========================================================= */

// التهيئة والمتغيرات العامة
const WHATSAPP_NUMBER = "201229430939";
const SUBMIT_ENDPOINT = ""; // يمكن إضافة رابط API هنا مستقبلاً

let currentStep = 1;
const totalSteps = 5;

let formData = {
    fullName: "",
    className: "",
    position: "",
    committee: "",
    skills: [],
    hobby: "",
    unionKnowledge: "",
    introducedBy: "",
    leaderRating: "",
    registrationId: "",
    date: ""
};

// عناصر DOM
const welcomeScreen = document.getElementById("welcomeScreen");
const app = document.getElementById("app");
const form = document.getElementById("registrationForm");
const successScreen = document.getElementById("successScreen");
const progressFill = document.getElementById("progressFill");
const currentStepElement = document.getElementById("currentStep");
const stepTitle = document.getElementById("stepTitle");
const backBtn = document.getElementById("backBtn");
const nextBtn = document.getElementById("nextBtn");

// عناوين المراحل
const stepTitles = {
    1: "البيانات الأساسية",
    2: "اختيار اللجنة",
    3: "المهارات",
    4: "بيانات إضافية",
    5: "المراجعة والاعتماد"
};

/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    // تحديث سنة الحقوق في الفوتر إن وجد العنصر
    const yearElement = document.getElementById("year");
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    updateVisitorCounter();
    setupRating();
    loadSavedData();
    updateUI();
});

/* =========================================================
   NAVIGATION & UI CONTROL
   ========================================================= */

function startRegistration() {
    welcomeScreen.classList.remove("active");
    welcomeScreen.classList.add("hidden");
    app.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateUI() {
    const steps = document.querySelectorAll(".form-step");
    steps.forEach(step => {
        const stepNumber = Number(step.dataset.step);
        step.classList.toggle("active", stepNumber === currentStep);
    });

    if (currentStepElement) currentStepElement.textContent = currentStep;
    if (stepTitle) stepTitle.textContent = stepTitles[currentStep];
    if (progressFill) progressFill.style.width = (currentStep / totalSteps) * 100 + "%";

    if (backBtn) backBtn.style.visibility = currentStep === 1 ? "hidden" : "visible";

    if (nextBtn) {
        if (currentStep === totalSteps) {
            nextBtn.innerHTML = `اعتماد التسجيل <b>✓</b>`;
            buildReview();
        } else {
            nextBtn.innerHTML = `التالي <b>←</b>`;
        }
    }
}

function nextStep() {
    if (!validateCurrentStep()) return;
    saveCurrentData();

    if (currentStep < totalSteps) {
        currentStep++;
        updateUI();
        window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
        submitRegistration();
    }
}

function previousStep() {
    if (currentStep <= 1) return;
    saveCurrentData();
    currentStep--;
    updateUI();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

/* =========================================================
   VALIDATION & DATA MANAGEMENT
   ========================================================= */

function validateCurrentStep() {
    if (currentStep === 1) {
        const name = document.getElementById("fullName").value.trim();
        const className = document.getElementById("className").value;
        const position = document.getElementById("position").value;

        if (!name) {
            showMessage("اكتب اسمك بالكامل أولاً", "error");
            return false;
        }
        if (!className) {
            showMessage("اختار الصف الدراسي", "error");
            return false;
        }
        if (!position) {
            showMessage("اختار موقعك في الاتحاد", "error");
            return false;
        }
    }

    if (currentStep === 2) {
        const committee = document.querySelector('input[name="committee"]:checked');
        if (!committee) {
            showMessage("اختار اللجنة اللي تناسبك", "error");
            return false;
        }
    }

    if (currentStep === 3) {
        const skills = document.querySelectorAll('input[name="skills"]:checked');
        if (skills.length === 0) {
            showMessage("اختار مهارة واحدة على الأقل", "error");
            return false;
        }
    }

    if (currentStep === 5) {
        const consent = document.getElementById("consent");
        if (consent && !consent.checked) {
            showMessage("لازم توافق على حفظ واستخدام بيانات التسجيل", "error");
            return false;
        }
    }

    return true;
}

function saveCurrentData() {
    formData.fullName = document.getElementById("fullName")?.value.trim() || "";
    formData.className = document.getElementById("className")?.value || "";
    formData.position = document.getElementById("position")?.value || "";

    const committee = document.querySelector('input[name="committee"]:checked');
    formData.committee = committee ? committee.value : "";

    formData.skills = Array.from(document.querySelectorAll('input[name="skills"]:checked')).map(input => input.value);
    formData.hobby = document.getElementById("hobby")?.value.trim() || "";
    formData.unionKnowledge = document.getElementById("unionKnowledge")?.value.trim() || "";
    formData.introducedBy = document.getElementById("introducedBy")?.value.trim() || "";
    formData.leaderRating = document.getElementById("leaderRating")?.value || "";

    localStorage.setItem("student_union_registration_v1", JSON.stringify(formData));
}

function loadSavedData() {
    const saved = localStorage.getItem("student_union_registration_v1");
    if (!saved) return;

    try {
        const data = JSON.parse(saved);
        formData = { ...formData, ...data };

        if (document.getElementById("fullName")) document.getElementById("fullName").value = formData.fullName || "";
        if (document.getElementById("className")) document.getElementById("className").value = formData.className || "";
        if (document.getElementById("position")) document.getElementById("position").value = formData.position || "";
        if (document.getElementById("hobby")) document.getElementById("hobby").value = formData.hobby || "";
        if (document.getElementById("unionKnowledge")) document.getElementById("unionKnowledge").value = formData.unionKnowledge || "";
        if (document.getElementById("introducedBy")) document.getElementById("introducedBy").value = formData.introducedBy || "";
        if (document.getElementById("leaderRating")) document.getElementById("leaderRating").value = formData.leaderRating || "";

        if (formData.committee) {
            const radio = document.querySelector(`input[name="committee"][value="${CSS.escape(formData.committee)}"]`);
            if (radio) radio.checked = true;
        }

        if (Array.isArray(formData.skills)) {
            formData.skills.forEach(skill => {
                const checkbox = document.querySelector(`input[name="skills"][value="${CSS.escape(skill)}"]`);
                if (checkbox) checkbox.checked = true;
            });
        }

        updateRating(Number(formData.leaderRating || 0));
    } catch (error) {
        console.error("تعذر تحميل البيانات المحفوظة", error);
    }
}

/* =========================================================
   RATING SYSTEM
   ========================================================= */

function setupRating() {
    const buttons = document.querySelectorAll("#rating button");
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const value = Number(button.dataset.rating);
            const input = document.getElementById("leaderRating");
            if (input) input.value = value;
            updateRating(value);
        });
    });
}

function updateRating(value) {
    const buttons = document.querySelectorAll("#rating button");
    buttons.forEach(button => {
        const number = Number(button.dataset.rating);
        button.classList.toggle("active", number <= value);
    });
}

/* =========================================================
   REVIEW & SUBMISSION
   ========================================================= */

function buildReview() {
    saveCurrentData();
    const box = document.getElementById("reviewBox");
    if (!box) return;

    const skills = formData.skills.length ? formData.skills.join("، ") : "لم يتم الاختيار";

    box.innerHTML = `
        <div class="review-item"><span>الاسم</span><strong>${escapeHTML(formData.fullName)}</strong></div>
        <div class="review-item"><span>الصف</span><strong>${escapeHTML(formData.className)}</strong></div>
        <div class="review-item"><span>الموقع</span><strong>${escapeHTML(formData.position)}</strong></div>
        <div class="review-item"><span>اللجنة</span><strong>${escapeHTML(formData.committee)}</strong></div>
        <div class="review-item"><span>المهارات</span><strong>${escapeHTML(skills)}</strong></div>
        <div class="review-item"><span>الهواية</span><strong>${escapeHTML(formData.hobby || "—")}</strong></div>
        <div class="review-item"><span>من عرفك بالاتحاد</span><strong>${escapeHTML(formData.introducedBy || "—")}</strong></div>
        <div class="review-item"><span>التقييم</span><strong>${formData.leaderRating || "—"} / 5</strong></div>
    `;
}

async function submitRegistration() {
    saveCurrentData();
    const now = new Date();
    formData.registrationId = generateRegistrationId();
    formData.date = now.toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" });

    localStorage.setItem("student_union_registration_v1", JSON.stringify(formData));
    createCertificate();

    if (SUBMIT_ENDPOINT) {
        try {
            await fetch(SUBMIT_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
        } catch (error) {
            console.warn("تعذر إرسال البيانات إلى Endpoint", error);
        }
    }

    const contentArea = document.querySelector(".content");
    const topBarArea = document.querySelector(".topbar");

    if (contentArea) contentArea.classList.add("hidden");
    if (topBarArea) topBarArea.classList.add("hidden");

    if (successScreen) successScreen.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

/* =========================================================
   CERTIFICATE & EXPORTS
   ========================================================= */

function createCertificate() {
    const certName = document.getElementById("certificateName");
    const certComm = document.getElementById("certificateCommittee");
    const certPos = document.getElementById("certificatePosition");
    const certId = document.getElementById("certificateId");
    const certDate = document.getElementById("certificateDate");

    if (certName) certName.textContent = formData.fullName;
    if (certComm) certComm.textContent = formData.committee;
    if (certPos) certPos.textContent = formData.position;
    if (certId) certId.textContent = formData.registrationId;
    if (certDate) certDate.textContent = formData.date;
}

function generateRegistrationId() {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const year = new Date().getFullYear();
    return `SU-${year}-${random}`;
}

function sendWhatsApp() {
    const skills = formData.skills.join("، ");
    const message = `📋 *تسجيل جديد - منصة اتحاد الطلاب*

👤 *الاسم:*
${formData.fullName}

🎓 *الصف:*
${formData.className}

🏅 *الموقع:*
${formData.position}

📚 *اللجنة:*
${formData.committee}

🛠 *المهارات:*
${skills}

✨ *الهواية:*
${formData.hobby || "غير محددة"}

💡 *المعرفة بالاتحاد:*
${formData.unionKnowledge || "غير محددة"}

👥 *الشخص الذي عرفه بالاتحاد:*
${formData.introducedBy || "غير محدد"}

⭐ *تقييم مؤمن القصاص:*
${formData.leaderRating || "غير محدد"} / 5

🆔 *رقم التسجيل:*
${formData.registrationId}

📅 *التاريخ:*
${formData.date}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
}

function printCertificate() {
    window.print();
}

function restartRegistration() {
    localStorage.removeItem("student_union_registration_v1");
    location.reload();
}

/* =========================================================
   UTILITIES
   ========================================================= */

function updateVisitorCounter() {
    let count = Number(localStorage.getItem("student_union_visitors_v1") || 0);
    count++;
    localStorage.setItem("student_union_visitors_v1", count);

    const counterElement = document.getElementById("visitorCount");
    if (counterElement) {
        counterElement.textContent = count.toLocaleString("ar-EG");
    }
}

function showMessage(message, type = "error") {
    const oldToast = document.querySelector(".toast-message");
    if (oldToast) oldToast.remove();

    const toast = document.createElement("div");
    toast.className = "toast-message";
    toast.textContent = message;

    Object.assign(toast.style, {
        position: "fixed",
        bottom: "25px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: "9999",
        padding: "14px 20px",
        borderRadius: "14px",
        background: "#151c31",
        border: "1px solid rgba(255, 255, 255, .12)",
        color: "white",
        fontFamily: "Cairo, sans-serif",
        fontSize: "12px",
        boxShadow: "0 15px 40px rgba(0, 0, 0, .35)",
        maxWidth: "90%",
        textAlign: "center"
    });

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transition = ".3s";
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
