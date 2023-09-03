const h2 =
  'Моё любимое увлечение — курить. Постоянное хобби — пытаться бросить курить.';
const p =
  'Счастье? Это роскошный ужин, сигара и любимая девушка — или нелюбимая, в зависимости от того, каким количеством счастья вы можете в этот момент распорядиться.';

function article(h2, p) {
  return `
    <article class="thumb">
      <a href="images/fulls/01.jpg" class="image">
        <img src="images/thumbs/01.jpg" alt="" />
      </a>
      <h2>${h2}</h2>
      <p>${p}</p>
    </article>`;
}

console.log(article(h2, p));
