let currword="",row =0,column=0,winstate=false;
let targetword;
let currRows;
const WORD_URL = "https://words.dev-apis.com/word-of-the-day";
const VAL_URL = "https://words.dev-apis.com/validate-word";

async function getWord() {
    const promise = await fetch(WORD_URL);
    const processedResponse = await promise.json();
    targetword=processedResponse.word;
}
getWord();
function rerender(row,currword,targetword){
    let currRow = document.querySelectorAll(".row")[row];
    count=0;
    while(count<currword.length) {
        
        currRow.querySelectorAll(".letter")[count].innerText=currword[count].toUpperCase();
        ++count;
    }
    while(count<5) {
        
        currRow.querySelectorAll(".letter")[count].innerText="";
        ++count;
    }
}

function rerenderColor(row,currword,targetword){
    let currRow = document.querySelectorAll(".row")[row];
    currw=Array.from(targetword);
    count=0;
    while(count<currword.length) {
        
        currelem=currRow.querySelectorAll(".letter")[count];
        if(currelem.innerText.toLowerCase()==targetword[count]){
            currelem.classList.add('green');
            delete currw[count];
        }
        else if(currw.includes(currelem.innerText.toLowerCase())){
            currelem.classList.add('yellow');
            delete currw[currw.indexOf(currelem.innerText)];
        }
        ++count;
    }
}

function rerenderHead(won){
    head=document.querySelector(".Main-title");
    if(won){
        head.classList.add('anim');
    }
    else{
        head.classList.add('lost');
    }

}
async function isValid(){
    const promise = await fetch(VAL_URL,{
        method:"POST",
        body:JSON.stringify({"word":currword})
    });
    const processedResponse = await promise.json();
    
    return  processedResponse.validWord;
}
function handleWord(letter){
    if(currword.length<=4){
        currword+=letter;
    }
    else{
        currword=currword.slice(0, -1)+letter;
    }
    console.log("handleword curr= ",currword);
    rerender(row,currword,targetword);
}
function handleBackspace(){
    currword = currword.slice(0, -1); 
    rerender(row,currword,targetword);
}
function handleEnter(){
    if(currword.length==5){
        isValid().then((validity)=>
        {
            if(validity){
                rerenderColor(row,currword,targetword);
                if(currword==targetword){
                    winstate=true;
                    console.log("you win"); 
                    rerenderHead(true); 
                }
                else{
                            console.log("Valid word but wrong");
                            ++row;
                            if(row>=6){
                                rerenderHead(false);
                                return;
                            }
                            
                            console.log("attempt no",row);
                            currword="";
                    }
            }else{
                console.log("Invalid word");
            }
        });
        
    }
    else{
        console.log("short word");
    }
    
}

window.addEventListener("keydown", function (event) {
    if(winstate){
        return;
    }
    if(row>=6){
        console.log("you lost");
        return;
    }
    if ((event.keyCode>64)&&(event.keyCode<96))
    { 
        handleWord(event.key); 
           
    }
    else if(event.key=="Backspace"){
        handleBackspace();
    }
    else if(event.key=="Enter"){
        handleEnter();
    }
    
  
      // Quit when this doesn't handle the key event.
    });

// document.addEventListener('keydown', function(event) {
//     console.log(event.key);
// });
