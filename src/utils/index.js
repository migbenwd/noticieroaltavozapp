/* eslint-disable no-restricted-syntax */
// en este archivo se arma url para publicidad

import { parse } from 'node-html-parser';

export const extractImagesWithTheirSource = (htmlString) => {
const imgRegex = /<img.*?data-src="([^"]+)".*?>/g;
const linkRegex = /<a.*?href="([^"]+)".*?>/g;

const document = parse(htmlString);
const divs = document.querySelectorAll('div.sin-click, div.con-click');

const arrayFinal = [];

for (const [indice, div] of divs.entries()) {
  const valorix = div.toString();

  const imagenesExtraidas = Array.from(
    valorix.matchAll(imgRegex),
    (match) => match[1]
  );

  const enlacesExtraidas = Array.from(
    valorix.matchAll(linkRegex),
    (match) => match[1]
  );

  const objetoExtraido = {
    image: imagenesExtraidas.toString(),
    // eslint-disable-next-line eqeqeq
    src: enlacesExtraidas == '' ? 'sin-url' : enlacesExtraidas.toString(),
  };

  arrayFinal.push(objetoExtraido);
}

  return arrayFinal;
};
