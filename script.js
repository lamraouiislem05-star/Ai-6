let model = '';
let history = [];
let chartData = [];
let chartLabels = [];

const ctx = document.getElementById('chartCanvas').getContext('2d');
const chart = new Chart(ctx, {
    type: 'line',
    data: { labels: chartLabels, datasets: [{ label: 'عدد كلمات Return', data: chartData, borderColor: 'lightgreen', backgroundColor: 'rgba(144,238,144,0.2)', fill: true }] },
    options: { responsive: true, scales: { y: { beginAtZero: true } } }
});

function appendChatHTML(html){
    const chatBox = document.getElementById('chatBox');
    chatBox.innerHTML += html;
    chatBox.scrollTop = chatBox.scrollHeight;
}

function expandLocal(text, type){
    const words = text.split(" ");
    let newWords = [];
    words.forEach(word=>{
        newWords.push(word);
        if(type==='text'||type==='mix'){ if(Math.random()<0.35){ newWords.push(word+'ly'); } }
        if(type==='numbers'||type==='mix'){ if(Math.random()<0.2) newWords.push(Math.floor(Math.random()*1000)); }
        if(type==='symbols'||type==='mix'){ if(Math.random()<0.2) newWords.push('@'); }
    });
    return newWords.join(" ");
}

function compressLocal(text,maxWords){
    const words = text.split(" ");
    const step = Math.max(1,Math.floor(words.length/maxWords));
    let compressed=[];
    for(let i=0;i<words.length;i+=step){ compressed.push(words[i]); }
    return compressed.slice(0,maxWords).join(" ");
}

async function runCycle(userText,maxWords){
    const expandType = document.getElementById('expandType').value;
    appendChatHTML(`<div class="message user"><b>المستخدم:</b> ${userText}</div>`);
    if(model==='') model=userText;
    const expandedLocal = expandLocal(model,expandType);
    const returned = compressLocal(expandedLocal,maxWords);
    appendChatHTML(`<div class="message return"><b>Return:</b> ${returned}</div>`);
    model=returned;
    history.push(returned);
    chartLabels.push(history.length);
    chartData.push(returned.split(" ").length);
    chart.update();
}

function sendMessage(){
    const input=document.getElementById('userInput');
    runCycle(input.value,parseInt(document.getElementById('maxWords').value));
    input.value='';
}

function sendMultiple(){
    const input=document.getElementById('userInput');
    for(let i=0;i<5;i++){ runCycle(input.value,parseInt(document.getElementById('maxWords').value)); }
    input.value='';
}
