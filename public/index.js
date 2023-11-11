// JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Код для обновления текста
  const articleIndexInput = document.getElementById("articleIndex");
  const elementTypeInput = document.getElementById("elementType");
  const currentTextElement = document.getElementById("currentText");

  const updateCurrentText = async () => {
    const articleIndex = articleIndexInput.value - 1; //----- поставил-1
    const elementType = elementTypeInput.value;

    // Получаем текущий текст с сервера
    const response = await fetch(
      `/currentText?articleIndex=${articleIndex}&elementType=${elementType}`
    );
    const data = await response.json();

    //console.log(data);
    currentTextElement.innerText =
      data.currentText || "Выберите Индекс article от 1 до 12:";
  };

  articleIndexInput.addEventListener("change", updateCurrentText);
  elementTypeInput.addEventListener("change", updateCurrentText);

  updateCurrentText();

  // Ваш исходный скрипт
  const form = document.getElementById("updateForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // const articleIndex = form.articleIndex.value;

    const articleIndex = form.articleIndex.value - 1;
    const elementType = form.elementType.value;
    const newText = form.newText.value;

    fetch("/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ articleIndex, elementType, newText }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Обработка ответа от сервера
      });
  });
});

// ---------------------------------------------------------------------------

// document.addEventListener("DOMContentLoaded", function () {
//   // Код для обновления текста
//   const articleIndexInput = document.getElementById('articleIndex');
//   const elementTypeInput = document.getElementById('elementType');
//   const currentTextElement = document.getElementById('currentText');

//   const updateCurrentText = async () => {
//     const articleIndex = articleIndexInput.value - 1; //----- поставил-1
//     const elementType = elementTypeInput.value;

//     // Получаем текущий текст с сервера
//     const response = await fetch(
//       `/currentText?articleIndex=${articleIndex}&elementType=${elementType}`
//     );

//     const data = await response.json();
//     currentTextElement.innerText = data.currentText || "Текст не найден";
//   };

//   articleIndexInput.addEventListener("change", updateCurrentText);
//   elementTypeInput.addEventListener("change", updateCurrentText);

//   updateCurrentText();

//   // Ваш исходный скрипт
//   const form = document.getElementById("updateForm");

//   form.addEventListener("submit", function (e) {
//     e.preventDefault();

//     // const articleIndex = form.articleIndex.value;
//     const articleIndex = form.articleIndex.value - 1;
//     const elementType = form.elementType.value;
//     const newText = form.newText.value;

//     fetch("/update", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ articleIndex, elementType, newText }),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         // Обработка ответа от сервера
//       });
//   });
// });
