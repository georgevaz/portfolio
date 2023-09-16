const container = document.createElement('div');
container.className = 'mockContainer';
let mock = `
    <div class="imageContainer">
      <img src='public/assets/left.svg'>
      <img class="mockImage" src=public/assets/Zukeeper-1.gif>
      <img src='public/assets/right.svg'>
    </div>
    <img src='public/assets/exit.svg'>
  `

const addMockDiv = () => {
  container.innerHTML = mock;
  document.body.appendChild(container);
};

const removeMockDiv = () => {
  document.body.removeChild(container);
};

export default { addMockDiv, removeMockDiv };