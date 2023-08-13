document.addEventListener("DOMContentLoaded", function () {
  const selectedTextElement = document.getElementById("selectedText");
  const translateButton = document.getElementById("translateButton");

  translateButton.addEventListener("click", function () {
    const selectedText = selectedTextElement.value;

    selectedTextElement.value = "Traduzindo...";

    fetchTranslation(selectedText)
      .then(translatedText => {
        selectedTextElement.value = translatedText;
      })
      .catch(error => {
        selectedTextElement.value = "Erro ao traduzir o texto.";
        console.error(error);
      });
  });

  chrome.tabs.executeScript({
    code: "window.getSelection().toString();"
  }, function (selection) {
    selectedTextElement.value = selection[0];
  });
});

async function fetchTranslation(text) {
  try {
    const response = await fetch("http://127.0.0.1:5000/classifier", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': "*",
        'Access-Control-Allow-Headers': "*"
      },
      body: JSON.stringify({ text: text })
    });

    if (!response.ok) {
      throw new Error("Erro na requisição à API");
    }

    const data = await response.json();
    return "Idioma: " + data.language
  } catch (error) {
    throw error;
  }
}
