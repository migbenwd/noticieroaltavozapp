// en este archivo se arma url para publicidad

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

  const filteredArray = likysx.filter(
    (element) => element.includes('sin-click') || element.includes('con-click')
  );
  const ConSinClickArray = filteredArray.map((item) =>
    item.replace('ms-slide ', '')
  );

  console.log(ConSinClickArray);

  return images.map((item, index) => {
    console.log('imagen:', images[index]);
    console.log('url:', urls[index]);
    // console.log('url:', urls[index]);

    if (images.length === urls.length) {
      return {
        image: item,
        src: urls[index],
      };
    }

    return {
      image: item,
      src: urls[0],
    };
  });
};
