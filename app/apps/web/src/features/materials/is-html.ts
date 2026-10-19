const htmlName = /\.html?$/i;

export const isHtml = (name: string, contentType: string) =>
  contentType.startsWith("text/html") || htmlName.test(name);
