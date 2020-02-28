// https://stackoverflow.com/questions/15248872/dynamically-create-2d-text-in-three-js

const text2 = document.createElement('div');
text2.style.position = 'absolute';
text2.style.width = 100;
text2.style.height = 100;
text2.style.padding = "8px";
text2.style.textAlign = 'center';
text2.style.borderStyle = 'none';

text2.style.top = 64 + 'px';
text2.style.left = 120 + 'px';
document.body.appendChild(text2);

export const setTextLabel = (text, clickedColor) => {
    text2.innerHTML = text;

    if (clickedColor) {
        text2.style.color = clickedColor;
        text2.style.borderColor = clickedColor
        text2.style.borderStyle = 'solid'
    } else {
        text2.style.borderStyle = 'none';
    }
}