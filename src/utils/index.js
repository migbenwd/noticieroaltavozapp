// en este archivo se arma url para publicidad

import { parse } from 'node-html-parser';

export const extractImagesWithTheirSource = (htmlString) => {
  const imgRegex = /<img.*?data-src="([^"]+)".*?>/g;
  const linkRegex = /<a.*?href="([^"]+)".*?>/g;
  const claseClick = /<div.*?class="([^"]+)".*?>/g;

  const images = Array.from(htmlString.matchAll(imgRegex), (match) => match[1]);
  const urls = Array.from(htmlString.matchAll(linkRegex), (match) => match[1]);
  const likysx = Array.from(
    htmlString.matchAll(claseClick),
    (match) => match[1]
  );

  // console.log('..htmlString..');
  // console.log('............');
  // console.log(htmlString);
  // console.log('............');

  const regex1 = /<div(.*?)>/g;
  // const regex1 = /<div>(.*?)<\/div>/g;

  // const regex1 = /<div([^>]+?)><\/div>/g;
  // const regex1 = /<div(.*?)><\/div>/g;
  // const regex1 = /<div>(.*?)<\/div>/g;

  const imagix = Array.from(htmlString.matchAll(regex1));
  // const imagix = htmlString.matchAll(regex1);

  console.log('...JUEVES...');
  // console.log('............');
  // console.log(imagix);
  // console.log('.....TAMAÑO.');
  // console.log(likysx.length);

  console.log('............');
  console.log('............');

  // --- PARSEAR   ------------------------------------------------------------//

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

    // Creamos un objeto con los datos extraídos
    const objetoExtraido = {
      image: imagenesExtraidas.toString(),
      puntoclick: enlacesExtraidas.toString(),
      src: enlacesExtraidas.toString(),
    };

    // Agregamos el objeto al arrayFinal
    arrayFinal.push(objetoExtraido);
  }

  console.log('array arrayFinal');
  // console.log(arrayFinal);
  console.log('..................');

  return arrayFinal;

  //   const arrayFinal = [];

  //   for (const [indice, div] of divs.entries()) {
  //   const valorix = div.toString();

  //   const imagenesExtraidas = Array.from(
  //     valorix.matchAll(imgRegex),
  //     (match) => match[1]
  //   );

  //   const enlacesExtraidas = Array.from(
  //     valorix.matchAll(linkRegex),
  //     (match) => match[1]
  //   );

  // }

  const filteredArray = likysx.filter(
    (element) => element.includes('sin-click') || element.includes('con-click')
  );
  const ConSinClickArray = filteredArray.map((item) =>
    item.replace('ms-slide ', '')
  );

  return images.map((item, index) => {
    // console.log('../..');
    // console.log(item);
    // return {
    //   image: item,
    //   src: urls[0],
    //   puntoclick: ConSinClickArray[index],
    // };
  });
};
