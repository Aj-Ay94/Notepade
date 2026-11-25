const $ =(id)=> document.getElementById(id);

const listNotes = $("listNotes");
const viewItem = $("viewItem");
const heading = $("heading");
const backBtn = $("backBtn");
const status = $("status");
const theme = $("dark-light");
const newNote = $("newNote");
const deleteBtn = $("delete");
const itemName = $("itemName");
const itemContent = $("itemContent");
const topics = $("topics");
const empty = $("empty");


let notes = [];
let current = null;
let KEY = "notepad-notes";
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
        p.textContent = n.body.trim().split("/n")[0]||"No content";

        const d = document.createElement("small");
        d.textContent = new Date(n.updated).toLocaleString([],{
            dateStyle : "medium",
            timeStyle : "short"
        });

        btn.append(t,p,d);
        btn.addEventListener("click",openNote(n.id));
        li.appendChild(btn);
        topics.appendChild(li);
    }
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
backBtn.addEventListener("click",()=>{

})



load();