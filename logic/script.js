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


let notes = [];
let current = null;
let KEY = "notepad-notes";

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

const openNote =(id)=>{
    current = notes.find((n)=>n.id===id);
    if(!current)return;
    itemName.value = current.title;
    itemContent.value = current.body;
    listNotes.hidden = true;
    viewItem.hidden = false;
    heading.textContent = "Edit";
    backBtn.hidden = false;
    status.hidden = true;
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

newNote.addEventListener("click", createNote);