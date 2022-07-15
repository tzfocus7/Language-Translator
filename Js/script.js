const selectTag = document.querySelectorAll("select");
const fromText = document.querySelector(".from-text");
const toText = document.querySelector(".to-text");
const exchangeIcon = document.querySelector(".exchange");
const translateBtn = document.querySelector("button");
const icons = document.querySelectorAll(".row i");

selectTag.forEach((tag, id) => { //forEach(select, n(select)) where n is the number of select tag
    for (const country_code in countries) { //country code are the key in object(countries)
       
        let selected;
        if (id == 0 && country_code == "en-GB"){ //selecting English by default as FROM language
            selected = "selected";
        } else if (id == 1 && country_code == "es-ES"){  //selecting Spanish by default as TO language
            selected = "selected";
        }

        let option = `<option value="${country_code}" ${selected}>${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
    }
});

//when exchange icon is clicked
exchangeIcon.addEventListener("click", () => {
    //exchanging textarea and select tag values
    let tempText = fromText.value, tempLang = selectTag[0].value;

    fromText.value = toText.value;
    selectTag[0].value = selectTag[1].value;

    toText.value = tempText;
    selectTag[1].value = tempLang;
})

//when translate button is clicked
translateBtn.addEventListener("click", () => {
    if (!fromText.value) return;
    toText.setAttribute("placeholder", "Translating...");

    let apiUrl = `https://api.mymemory.translated.net/get?q=${fromText.value}&langpair=${selectTag[0].value}|${selectTag[1].value}it`;
    
    //fetching api response and returning it with parsing into js obj
    // and in another then method receiving that obj
    fetch(apiUrl).then(res => res.json()).then(data => {
        console.log(data);
        toText.value = data.responseData.translatedText; //from the console
    })
});

icons.forEach(icon => {
    icon.addEventListener("click", ({target}) => { //target displays the particular icon clicked
        if (target.classList.contains("fa-copy")){
            //if clicked icon has from id, copy the fromTextare value else copy the toTextare value
            if (target.id == "from"){
                navigator.clipboard.writeText(fromText.value); //writext() method writes the specified text string to the system clipboard
            } else {
                navigator.clipboard.writeText(toText.value);
            }

        } else {
            let utterance;
            if (target.id == "from"){
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value;
            } else {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value;
            }
            speechSynthesis.speak(utterance); //speak the passed utterance
        }
    })
})