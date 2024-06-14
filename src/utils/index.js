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

  // const divs = document.querySelectorAll('div');
  // const divs = document.querySelectorAll('div.con-click');
  const divs = document.querySelectorAll('div.sin-click, div.con-click');

  for (const [indice, div] of divs.entries()) {
    console.log(`........DIV ${indice + 1}........`); // Se agrega el índice + 1 al título
    const valorix = div.toString();
    console.log(valorix);
  }

  // for (const div of divs) {
  //   console.log('........DIV........');
  //   const valorix = div.toString();
  //   console.log(valorix);
  // }

  // -------------------------------------------------------------------//

  // const p = 0;
  // for (const match of likysx) {
  //   console.log(match);
  //   if (match === 'ms-slide con-click') {
  //     const claseRox = /<div.*?class="ms-slide con-click".*?>/g;
  //     const matches = html.matchAll(claseRox);
  //     console.log(matches.map((match) => match[1]));
  //   }
  // }

  // for (const match of imagix) {
  //   console.log("Contenido MATCH 0:");
  //   console.log(match[0]);
  // }

  const filteredArray = likysx.filter(
    (element) => element.includes('sin-click') || element.includes('con-click')
  );
  const ConSinClickArray = filteredArray.map((item) =>
    item.replace('ms-slide ', '')
  );

  return images.map((item, index) => {
    // console.log('../..');
    // console.log('index:', index);
    // console.log('imagen:', images[index]);
    // console.log('url:', urls[index]);
    // console.log('ConSinClickArray:', ConSinClickArray[index]);

    return {
      image: item,
      src: urls[0],
      puntoclick: ConSinClickArray[index],
    };
  });
};
