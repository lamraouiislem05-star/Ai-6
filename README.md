<!DOCTYPE html>
<html lang="ar">
<head>
<meta charset="UTF-8">
<title>AI 1 ∞ 1 – النسخة الاحترافية</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style>
body { font-family: Arial, sans-serif; background: #1e1e1e; color: #fff; padding: 20px; }
#chatBox { width: 100%; height: 350px; background: #2e2e2e; overflow-y: scroll; padding: 10px; margin-bottom: 10px; border-radius: 5px; }
input[type=text] { width: 50%; padding: 10px; border-radius: 5px; border: none; }
select, input[type=number] { padding: 5px; border-radius: 5px; border: none; margin-left:5px;}
button { padding: 10px 20px; margin-left: 5px; border-radius: 5px; font-size: 16px; }
.message { margin: 5px 0; }
.user { color: cyan; }
.seed { color: yellow; }
.expand { color: violet; }
.return { color: lightgreen; }
</style>
</head>
<body>

<h2>AI 1 ∞ 1 – النسخة الاحترافية</h2>

<div id="chatBox"></div>

<input type="text" id="userInput" placeholder="اكتب رسالتك هنا...">
<input type="number" id="maxWords" value="25" title="أقصى عدد كلمات Return">
<select id="expandType">
  <option value="text">نص</option>
  <option value="numbers">أرقام</option>
  <option value="symbols">رموز</option>
  <option value="mix">مزيج</option>
</select>
<button onclick="sendMessage()">دورة واحدة</button>
<button onclick="sendMultiple()">5 دورات</button>
<button onclick="saveProject()">حفظ المشروع</button>
<button onclick="loadProject()">استعادة المشروع</button>

<h3>مخطط طول النص بعد كل دورة</h3>
<canvas id="chartCanvas" width="400" height="150"></canvas>

<script>
const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY'; // ضع مفتاحك هنا

let model = '';
let history = [];
let chartData = [];
let chartLabels = [];

const ctx = document.getElementById('chartCanvas').getContext('2d');
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: chartLabels,
        datasets: [{
            label: 'عدد كلمات Return',
            data: chartData,
            borderColor: 'lightgreen',
            backgroundColor: 'rgba(144,238,144,0.2)',
            fill: true
        }]
    },
    options: { responsive: true, scales: { y: { beginAtZero: true } } }
});

function appendChatHTML(html){
    const chatBox = document.getElementById('chatBox');
    chatBox.innerHTML += html;
    chatBox.scrollTop = chatBox.scrollHeight;
}

// التوسع المحلي
function expandLocal(text, type){
    const words = text.split(" ");
    let newWords = [];
    words.forEach(word=>{
        newWords.push(word);
        if(type === "text" || type === "mix"){
            if(Math.random() < 0.35){
                const suffixes = ['ly','ish','ed','s','er','ing','tron','ix','or'];
                newWords.push(word + suffixes[Math.floor(Math.random()*suffixes.length)]);
            }
        }
        if(type === "numbers" || type === "mix"){
            if(Math.random() < 0.2) newWords.push(Math.floor(Math.random()*1000));
        }
        if(type === "symbols" || type === "mix"){
            if(Math.random() < 0.2) newWords.push(['@','#','$','%','&'][Math.floor(Math.random()*5)]);
        }
        if(Math.random() < 0.2) newWords.push(word);
    });
    return newWords.join(" ");
}

// ضغط النصوص
function compressLocal(text, maxWords){
    const words = text.split(" ");
    const step = Math.max(1, Math.floor(words.length/maxWords));
    let compressed = [];
    for(let i=0; i<words.length; i+=step){
        compressed.push(words[i]);
    }
    return compressed.slice(0, maxWords).join(" ");
}

// التوسع باستخدام OpenAI
async function expandWithOpenAI(text){
    try{
        const response = await fetch('https://api.openai.com/v1/chat/completions',{
            method:'POST',
            headers:{'Content-Type':'application/json','Authorization':`Bearer ${OPENAI_API_KEY}`},
            body:JSON.stringify({
                model:"gpt-4o-mini",
                messages:[{role:"user", content:`Expand creatively in AI 1∞1 style: "${text}"`}],
                max_tokens:150
            })
        });
        const data = await response.json();
        return data.choices[0].message.content.trim();
    } catch(err){
        console.error(err);
        return expandLocal(text,'mix'); // fallback
    }
}

// دورة واحدة
async function runCycle(userText, maxWords){
    const expandType = document.getElementById('expandType').value;
    appendChatHTML(`<div class="message user"><b>المستخدم:</b> ${userText}</div>`);
    if(model==='') model=userText;

    appendChatHTML(`<div class="message seed"><b>Seed (1):</b> ${model}</div>`);

    const expandedLocal = expandLocal(model, expandType);
    const expandedAI = await expandWithOpenAI(model);
    const combinedExpansion = expandedLocal + " | " + expandedAI;

    appendChatHTML(`<div class="message expand"><b>Expansion (∞):</b> ${combinedExpansion}</div>`);

    const returned = compressLocal(combinedExpansion,maxWords);
    appendChatHTML(`<div class="message return"><b>Return (1):</b> ${returned}</div>`);

    model=returned;
    history.push(returned);

    chartLabels.push(history.length);
    chartData.push(returned.split(" ").length);
    chart.update();
}

// أزرار الشات
function sendMessage(){
    const input = document.getElementById('userInput');
    const text = input.value.trim();
    const maxWords = parseInt(document.getElementById('maxWords').value);
    if(text==='') return;
    runCycle(text,maxWords);
    input.value='';
}

function sendMultiple(numCycles=5){
    const input = document.getElementById('userInput');
    const text = input.value.trim();
    const maxWords = parseInt(document.getElementById('maxWords').value);
    if(text==='') return;
    for(let i=0;i<numCycles;i++){
        runCycle(text,maxWords);
    }
    input.value='';
}

// حفظ واستعادة المشاريع
function saveProject(){
    const project = {model, history, chartData, chartLabels};
    localStorage.setItem('ai1Inf1Professional',JSON.stringify(project));
    alert('تم حفظ المشروع بنجاح!');
}

function loadProject(){
    const project = JSON.parse(localStorage.getItem('ai1Inf1Professional'));
    if(!project){alert('لا يوجد مشروع محفوظ.'); return;}
    model = project.model;
    history = project.history;
    chartData = project.chartData;
    chartLabels = project.chartLabels;
    chart.data.labels=chartLabels;
    chart.data.datasets[0].data=chartData;
    chart.update();

    const chatBox=document.getElementById('chatBox');
    chatBox.innerHTML='';
    history.forEach((text,idx)=>{
        appendChatHTML(`<div class="message return"><b>دورة ${idx+1} Return (1):</b> ${text}</div>`);
    });
}
</script>

</body>
</html>
