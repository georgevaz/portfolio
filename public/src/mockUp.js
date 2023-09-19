const container = document.createElement('div');
container.className = 'mockContainer';

let mock = `
    <div class="imageContainer">
      <div class="left" id="left">
        <img class="left" src="./assets/left.svg">
      </div>
      <img class="mockImage" id="image">
      <div class="right" id="right">
        <img class="right" src="./assets/right.svg">
      </div>
    </div>
    <div class="exit">
      <img class="exit" src="./assets/exit.svg">
    </div>
  `;

const addMockDiv = (images) => {
  let totalImageCount = images.length;
  let index = 0;

  document.body.appendChild(container);
  container.innerHTML = mock;

  const image = document.getElementById('image');
  image.src = images[index];

  document.getElementById('left').addEventListener('click', () => {
    index === 0 ? index = totalImageCount - 1 : index--;
    image.src = images[index];
  });

  document.getElementById('right').addEventListener('click', () => {
    index === totalImageCount - 1 ? index = 0 : index++;
    image.src = images[index];
  });
};

const removeMockDiv = () => {
  document.body.removeChild(container);
};

export default { addMockDiv, removeMockDiv };