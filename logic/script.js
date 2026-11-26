const $ =(id)=> document.getElementById(id);

const listNotes = $("listNotes");
const viewItem = $("viewItem");
const heading = $("heading");
const backBtn = $("backBtn");
const status = $("status");
const themeBtn = $("dark-light");
const newNote = $("newNote");
const deleteBtn = $("delete");
const itemName = $("itemName");
const itemContent = $("itemContent");
const topics = $("topics");
const empty = $("empty");
const html = document.documentElement;


let notes = [];
let current = null;
let KEY = "notepad-notes";
let theme = "theme";
let timer;

const load =()=>{
    try{
        notes = JSON.parse(localStorage.getItem(KEY))||[];
    }catch(e){
        notes = [];
        status.textContent = "Storage not available.";
    }
}

const save =()=>{
    try{
        localStorage.setItem(KEY,JSON.stringify(notes));
        return true;
    }catch(e){
        status.textContent = "Could not save.";
        return false;
    }
}

try{
    html.dataset.theme = localStorage.getItem(theme);
}catch(e){
    status.textContent = "Theme not loaded";
}

themeBtn.addEventListener("click",()=>{
    const currentTheme = html.dataset.theme || (matchMedia("prefers-color-scheme: dark").matches? "dark":"light");
    html.dataset.theme = currentTheme === "dark"? "light":"dark";
    if(html.dataset.theme === "dark"){
        themeBtn.textContent = "Light";
    }else{
        themeBtn.textContent = "Dark";
    }

    try{
        localStorage.setItem(theme,html.dataset.theme);
    }catch(e){
        status.textContent = "Theme could not be saved";
    }
});

const renderNotes =()=>{
    topics.innerHTML = "";
    const sorted = [...notes].sort((a,b)=>b.updated-a.updated);
    empty.hidden =sorted.length>0;

    for(const n of sorted){
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.className = "topic";
        btn.type = "button";

        const t = document.createElement("strong");
        t.textContent = n.title.trim()||"Untitled";

        const p = document.createElement("span");
        p.textContent = n.body.trim().split("\n")[0]||"No content";

        const d = document.createElement("small");
        d.textContent = new Date(n.updated).toLocaleString([],{
            dateStyle : "medium",
            timeStyle : "short"
        });

        btn.append(t,p,d);
        btn.addEventListener("click",()=>openNote(n.id));
        li.appendChild(btn);
        topics.appendChild(li);
    }
}

const showList =()=>{
    clearTimeout(timer);
    flush();
    current = null;
    viewItem.hidden = true;
    listNotes.hidden = false;
    heading.textContent = "Notes";
    backBtn.hidden = true;
    status.textContent = "saved";
    newNote.hidden = false;
    deleteBtn.hidden = true;
    renderNotes();
}

const openNote =(id)=>{
    current = notes.find((n)=>n.id===id);
    if(!current)return;
    itemName.value = current.title;
    itemContent.value = current.body;
    listNotes.hidden = true;
    viewItem.hidden = false;
    heading.textContent = "Edit";
    backBtn.hidden = false;
    status.textContent = "";
    newNote.hidden = true;
    deleteBtn.hidden = false;
    (current.title?itemContent:itemName).focus();
}

const createNote =()=>{
    const n = {id: String(Date.now()), title: "", body: "", updated: Date.now()};
    notes.push(n);
    save();
    openNote(n.id);
}

const flush =()=>{
    if(!current)return;
    current.title = itemName.value;
    current.body = itemContent.value;
    current.updated = Date.now();
    if(save())status.textContent = "saved";
}

const queueSave =()=>{
    status.textContent = "saving...";
    clearTimeout(timer);
    timer = setTimeout(flush,400);
}

itemName.addEventListener("input",queueSave);
itemContent.addEventListener("input",queueSave);
newNote.addEventListener("click", createNote);
backBtn.addEventListener("click",showList);

deleteBtn.addEventListener("click",()=>{
    notes.pop(current);
    current = null;
    listNotes.hidden = false;
    viewItem.hidden = true;
    backBtn.hidden = true;
    deleteBtn.hidden = true;
    newNote.hidden = false;
    status.textContent = "saved";
    heading.textContent = "Notes";
    save();
    renderNotes();
})

window.addEventListener("pagehide",flush);

load();
renderNotes();