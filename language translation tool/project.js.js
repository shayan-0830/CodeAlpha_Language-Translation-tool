// Define supported languages (Few Examples. Add more as needed.)
const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "ru", name: "Russian" },
    { code: "ar", name: "Arabic" },
    { code: "zh", name: "Chinese" },
    { code: "tr", name: "Turkish" },
    { code: "pt", name: "Portuguese" },
    { code: "it", name: "Italian" }
];

// Populate dropdowns
const srcLangSelect = document.getElementById('sourceLang');
const tgtLangSelect = document.getElementById('targetLang');
languages.forEach(lang => {
    const optSrc = document.createElement('option');
    optSrc.value = lang.code;
    optSrc.textContent = lang.name;
    srcLangSelect.appendChild(optSrc);

    const optTgt = document.createElement('option');
    optTgt.value = lang.code;
    optTgt.textContent = lang.name;
    tgtLangSelect.appendChild(optTgt);
});
// Set sensible defaults
srcLangSelect.value = 'en';
tgtLangSelect.value = 'es';

// Handle translation
document.getElementById('translateBtn').onclick = async function() {
    const inputText = document.getElementById('inputText').value.trim();
    const from = srcLangSelect.value;
    const to = tgtLangSelect.value;
    const errorMsg = document.getElementById('errorMsg');
    errorMsg.innerText = "";
    document.getElementById('translatedText').value = "";

    if (!inputText) {
        errorMsg.innerText = "Please enter text to translate.";
        return;
    }
    if (from === to) {
        errorMsg.innerText = "Source and target languages must differ.";
        return;
    }
    // Make API call to LibreTranslate (public instance)
    try {
        const response = await fetch('https://libretranslate.com/translate', {
            method: "POST",
            body: JSON.stringify({
                q: inputText,
                source: from,
                target: to,
                format: "text"
            }),
            headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) throw new Error("Translation failed");
        const data = await response.json();
        document.getElementById('translatedText').value = data.translatedText;
    } catch (err) {
        errorMsg.innerText = "Could not translate. Please try later.";
    }
};

// Copy functionality
document.getElementById('copyBtn').onclick = function() {
    const translated = document.getElementById('translatedText').value;
    if (translated) {
        navigator.clipboard.writeText(translated)
            .then(() => alert('Copied!'))
            .catch(() => alert('Copy failed'));
    }
};

// Speak functionality
document.getElementById('speakBtn').onclick = function() {
    const translated = document.getElementById('translatedText').value;
    const langCode = tgtLangSelect.value;
    if (translated) {
        const utter = new SpeechSynthesisUtterance(translated);
        utter.lang = langCode;
        window.speechSynthesis.speak(utter);
    }
};
