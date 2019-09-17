export const parseQuery = search =>
  !!search &&
  JSON.parse(
    '{"' +
      decodeURI(search.substring(1))
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}',
  );
