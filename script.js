const WHATSAPP_NUMBER="201229430939";
let currentStep=1;
const totalSteps=7;
let rating=0;
function startRegistration(){
const section=document.getElementById("registration");
section.classList.remove("hidden");
section.scrollIntoView({behavior:"smooth"});
updateStep();
}
function nextStep(){
if(!validateCurrentStep())return;
if(currentStep<totalSteps){currentStep++;updateStep();}
}
function previousStep(){
if(currentStep>1){currentStep--;updateStep();}
}
function updateStep(){
document.querySelectorAll(".step").forEach(s=>s.classList.remove("active-step"));
const active=document.querySelector(`.step[data-step="${currentStep}"]`);
if(active)active.classList.add("active-step");
document.getElementById("progressBar").style.width=(currentStep/totalSteps)*100+"%";
document.getElementById("stepNumber").textContent=String(currentStep).padStart(2,"0");
const titles={1:"خلينا نتعرف عليك 👋🏻",2:"اختار مكانك في الاتحاد 🎯",3:"أنت شاطر في إيه؟ 🚀",4:"بتحب تنفذ أنشطة فين؟ 🔥",5:"عرفنا أكتر عنك ✨",6:"رأيك يهمنا ⭐",7:"آخر خطوة... جاهز؟ 🚀"};
document.getElementById("stepTitle").textContent=titles[currentStep];
document.getElementById("prevBtn").style.visibility=currentStep===1?"hidden":"visible";
document.getElementById("nextBtn").style.display=currentStep===totalSteps?"none":"inline-flex";
if(currentStep===7)createReview();
}
function validateCurrentStep(){
if(currentStep===1){
const name=document.getElementById("name").value.trim();
const grade=document.getElementById("grade").value.trim();
const classroom=document.getElementById("classroom").value.trim();
const position=document.querySelector('input[name="position"]:checked');
if(!name||!grade||!classroom||!position){showAlert("من فضلك أكمل الاسم والصف والفصل واختار منصبك.");return false;}
}
if(currentStep===2&&!document.querySelectorAll('input[name="committee"]:checked').length){showAlert("اختار لجنة واحدة على الأقل.");return false;}
if(currentStep===3&&!document.querySelectorAll('input[name="skills"]:checked').length){showAlert("اختار مهارة واحدة على الأقل.");return false;}
if(currentStep===6&&!rating){showAlert("من فضلك اختر تقييمك.");return false;}
return true;
}
function showAlert(message){alert(message);}
document.querySelectorAll("#rating button").forEach(button=>{
button.addEventListener("click",()=>{
rating=Number(button.dataset.value);
document.querySelectorAll("#rating button").forEach(star=>star.classList.toggle("active",Number(star.dataset.value)<=rating));
});
});
function getChecked(name){
return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(x=>x.value);
}
function createReview(){
const name=document.getElementById("name").value;
const grade=document.getElementById("grade").value;
const classroom=document.getElementById("classroom").value;
const position=document.querySelector('input[name="position"]:checked')?.value||"غير محدد";
const committees=getChecked("committee");
const skills=getChecked("skills");
const activities=getChecked("activities");
const hobbies=document.getElementById("hobbies").value;
const introducedBy=document.getElementById("introducedBy").value;
document.getElementById("review").innerHTML=`
<div class="review-row"><span>الاسم</span><strong>${escapeHTML(name)}</strong></div>
<div class="review-row"><span>الصف</span><strong>${escapeHTML(grade)}</strong></div>
<div class="review-row"><span>الفصل</span><strong>${escapeHTML(classroom)}</strong></div>
<div class="review-row"><span>المنصب</span><strong>${escapeHTML(position)}</strong></div>
<div class="review-row"><span>اللجان</span><strong>${escapeHTML(committees.join("، "))}</strong></div>
<div class="review-row"><span>المهارات</span><strong>${escapeHTML(skills.join("، "))}</strong></div>
<div class="review-row"><span>الأنشطة</span><strong>${escapeHTML(activities.join("، ")||"لم يحدد")}</strong></div>
<div class="review-row"><span>الهوايات</span><strong>${escapeHTML(hobbies)||"لم يحدد"}</strong></div>
<div class="review-row"><span>عرف الاتحاد عن طريق</span><strong>${escapeHTML(introducedBy)||"لم يحدد"}</strong></div>`;
}
document.getElementById("registrationForm").addEventListener("submit",function(e){
e.preventDefault();
const name=document.getElementById("name").value.trim();
const grade=document.getElementById("grade").value.trim();
const classroom=document.getElementById("classroom").value.trim();
const phone=document.getElementById("phone").value.trim();
const email=document.getElementById("email").value.trim();
const position=document.querySelector('input[name="position"]:checked')?.value||"";
const committees=getChecked("committee");
const skills=getChecked("skills");
const activities=getChecked("activities");
const hobbies=document.getElementById("hobbies").value.trim();
const unionKnowledge=document.getElementById("unionKnowledge").value.trim();
const introducedBy=document.getElementById("introducedBy").value.trim();
const message=document.getElementById("message").value.trim();
const date=new Date().toLocaleString("ar-EG");
const whatsappMessage=`🚀 *تسجيل جديد — اتحاد طلاب المدرسة*
👤 *الاسم:* ${name}
🎓 *الصف:* ${grade}
🏫 *الفصل:* ${classroom}
🏅 *المنصب:* ${position}
📚 *اللجان:* ${committees.join("، ")}
🎯 *المهارات:* ${skills.join("، ")}
🔥 *مجالات الأنشطة:* ${activities.join("، ")||"لم يحدد"}
🎨 *الهوايات:* ${hobbies||"لم يحدد"}
📖 *معرفته بالاتحاد:* ${unionKnowledge||"لم يحدد"}
👥 *عرف الاتحاد عن طريق:* ${introducedBy||"لم يحدد"}
⭐ *التقييم:* ${rating}/5
💬 *الكلمة أو الاقتراح:* ${message||"لا يوجد"}
📞 *الهاتف:* ${phone||"لم يحدد"}
📧 *البريد:* ${email||"لم يحدد"}
🕐 *وقت التسجيل:* ${date}
━━━━━━━━━━━━━━
*منصة اتحاد طلاب المدرسة*
*المؤسس: مؤمن القصاص*`;
const url=`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
window.open(url,"_blank");
document.getElementById("registration").classList.add("hidden");
document.getElementById("success").classList.remove("hidden");
document.getElementById("certificateName").textContent=`أهلًا بيك يا قائد، ${name}`;
document.getElementById("certificateStudent").textContent=name;
document.getElementById("success").scrollIntoView({behavior:"smooth"});
});
function escapeHTML(value){
return String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
}
let visitors=Number(localStorage.getItem("unionVisitors")||0);
visitors++;
localStorage.setItem("unionVisitors",visitors);
document.getElementById("visitorCount").textContent=visitors.toLocaleString("en-US");
document.getElementById("themeBtn").addEventListener("click",()=>{
document.body.classList.toggle("light-mode");
const icon=document.querySelector("#themeBtn svg");
if(icon)icon.setAttribute("data-lucide",document.body.classList.contains("light-mode")?"sun":"moon");
if(window.lucide)lucide.createIcons();
});
if(window.lucide)lucide.createIcons();
