let div = document.createElement('div');
div.append('some text');
div.className = 'mockContainer';

const addMockDiv = () => {
  document.body.appendChild(div);
};

const removeMockDiv = () => {
  document.body.removeChild(div);
};

export default { addMockDiv, removeMockDiv };