import projects from './_projects.js';

const container = document.createElement('div');
container.className = 'mockContainer';

let mock = `
    <div class="imageContainer">
      <img src="public/assets/left.svg" id="left">
      <img class="mockImage" src="public/assets/Zukeeper-1.gif" id="image">
      <img src="public/assets/right.svg" id="right">
    </div>
    <img src="public/assets/exit.svg" id="exit">
  `;


const addMockDiv = (project) => {
  container.innerHTML = mock;
  document.body.appendChild(container);
  console.log(project)
};

const removeMockDiv = () => {
  document.body.removeChild(container);
};

export default { addMockDiv, removeMockDiv };