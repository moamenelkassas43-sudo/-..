const WA="201229430939";

let step=1;
const total=7;
let rating=0;

const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];

const titles={
1:"خلينا نتعرف عليك 👋🏻",
2:"اختار لجنتك 🎯",
3:"أنت شاطر في إيه؟ 🚀",
4:"بتحب تنفذ أنشطة فين؟ 🔥",
5:"عرفنا أكتر عنك ✨",
6:"رأيك يهمنا ⭐",
7:"آخر خطوة... جاهز؟ 🚀"
};


function start(){

const r=$("#register");

r.classList.remove("hidden");

r.scrollIntoView({
behavior:"smooth",
block:"start"
});

render();

}


document.addEventListener("click",e=>{

if(e.target.closest("[data-start]")){
start();
}

});


function checked(name){

return $$(
`input[name="${name}"]:checked`
).map(x=>x.value);

}


function esc(v){

return String(v||"").replace(
/[&<>"']/g,
m=>({
"&":"&amp;",
"<":"&lt;",
">":"&gt;",
'"':"&quot;",
"'":"&#039;"
}[m])
);

}


function valid(){

if(step===1){

if(
!$("#name").value.trim()||
!$("#grade").value.trim()||
!$("#classroom").value.trim()||
!$('input[name="position"]:checked')
){

alert(
"أكمل الاسم والصف والفصل واختار المنصب أولًا."
);

return false;

}

}


if(step===2&&!checked("committee").length){

alert(
"اختار لجنة واحدة على الأقل."
);

return false;

}


if(step===3&&!checked("skills").length){

alert(
"اختار مهارة واحدة على الأقل."
);

return false;

}


if(step===6&&!rating){

alert(
"اختار تقييمك من النجوم."
);

return false;

}


return true;

}


function render(){

$$(".step").forEach(x=>{

x.classList.toggle(
"active",
+x.dataset.step===step
);

});


$("#stepNo").textContent=
String(step).padStart(2,"0");

$("#stepTitle").textContent=
titles[step];

$("#progress").style.width=
(step/total*100)+"%";


$("#backBtn").style.visibility=
step===1?"hidden":"visible";


$("#nextBtn").style.display=
step===total?"none":"block";


if(step===total){

review();

}

}


$("#nextBtn").onclick=()=>{

if(valid()&&step<total){

step++;

render();

window.scrollTo({
top:$("#register").offsetTop-90,
behavior:"smooth"
});

}

};


$("#backBtn").onclick=()=>{

if(step>1){

step--;

render();

window.scrollTo({
top:$("#register").offsetTop-90,
behavior:"smooth"
});

}

};


$$(".stars button").forEach(b=>{

b.onclick=()=>{

rating=+b.dataset.rate;

$$(".stars button").forEach(x=>{

x.classList.toggle(
"active",
+x.dataset.rate<=rating
);

});

};

});


function review(){

const pos=
$('input[name="position"]:checked')?.value||"—";

const rows=[

["الاسم",$("#name").value],

["الصف",$("#grade").value],

["الفصل",$("#classroom").value],

["المنصب",pos],

["اللجان",checked("committee").join("، ")],

["المهارات",checked("skills").join("، ")],

[
"الأنشطة",
checked("activities").join("، ")||
"لم يحدد"
],

[
"الهوايات",
$("#hobbies").value||
"لم يحدد"
],

[
"التعريف بالاتحاد",
$("#introducedBy").value||
"لم يحدد"
],

[
"التقييم",
rating+"/5"
]

];


$("#review").innerHTML=

rows.map(r=>`

<div class="review-row">

<span>${esc(r[0])}</span>

<strong>${esc(r[1])}</strong>

</div>

`).join("");

}


$("#unionForm").onsubmit=e=>{

e.preventDefault();

if(!valid())return;


const name=
$("#name").value.trim();

const grade=
$("#grade").value.trim();

const cls=
$("#classroom").value.trim();

const phone=
$("#phone").value.trim();

const email=
$("#email").value.trim();

const pos=
$('input[name="position"]:checked')?.value||"";

const committees=
checked("committee");

const skills=
checked("skills");

const activities=
checked("activities");

const hobbies=
$("#hobbies").value.trim();

const knowledge=
$("#unionKnowledge").value.trim();

const introduced=
$("#introducedBy").value.trim();

const msg=
$("#message").value.trim();


const text=

`🚀 *تسجيل جديد — اتحاد طلاب المدرسة*

👤 الاسم: ${name}

🎓 الصف: ${grade}

🏫 الفصل: ${cls}

🏅 المنصب: ${pos}

📚 اللجان: ${committees.join("، ")}

🎯 المهارات: ${skills.join("، ")}

🔥 الأنشطة: ${activities.join("، ")||"لم يحدد"}

🎨 الهوايات: ${hobbies||"لم يحدد"}

📖 ماذا يعرف عن الاتحاد:
${knowledge||"لم يحدد"}

👥 عرف الاتحاد عن طريق:
${introduced||"لم يحدد"}

⭐ التقييم: ${rating}/5

💬 الكلمة:
${msg||"لا يوجد"}

📞 الهاتف: ${phone||"لم يحدد"}

📧 البريد: ${email||"لم يحدد"}

━━━━━━━━━━━━━━

*منصة اتحاد طلاب المدرسة*

*المؤسس: مؤمن القصاص*`;


localStorage.setItem(
"unionLastRegistration",
JSON.stringify({

name,
grade,
cls,
phone,
email,
pos,
committees,
skills,
activities,
hobbies,
knowledge,
introduced,
rating,
msg,
date:new Date().toISOString()

})
);


window.open(
`https://wa.me/${WA}?text=${encodeURIComponent(text)}`,
"_blank"
);


$("#register").classList.add("hidden");

$("#success").classList.remove("hidden");

$("#successName").textContent=
`أهلًا بيك يا قائد، ${name}`;

$("#certificateName").textContent=
name;


const words=[

"طموحك وإصرارك يصنعان فرقًا.",

"شغفك وثقتك بداية لأثر كبير.",

"فكرك وحماسك قادران على صناعة التغيير.",

"حضورك وطموحك إضافة حقيقية للفريق."

];


$("#certificateWords").textContent=
words[
Math.floor(Math.random()*words.length)
];


$("#success").scrollIntoView({
behavior:"smooth"
});

};


$("#printBtn").onclick=()=>{

window.print();

};


let visitors=
Number(
localStorage.getItem("unionVisitors")||0
)+1;


localStorage.setItem(
"unionVisitors",
visitors
);


$("#visitorCount").textContent=
visitors.toLocaleString("en-US");


$("#themeToggle").onclick=()=>{

document.body.classList.toggle("light");

};
