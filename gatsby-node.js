/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const removeSpecial = NameFile => {
  NameFile = NameFile.replace('ó', 'o');
  NameFile = NameFile.replace('Ó', 'o');
  NameFile = NameFile.replace('ł', 'l');
  NameFile = NameFile.replace('Ł', 'l');
  NameFile = NameFile.replace('ń', 'n');
  NameFile = NameFile.replace('Ń', 'n');
  NameFile = NameFile.replace('ż', 'z');
  NameFile = NameFile.replace('Ż', 'z');
  NameFile = NameFile.replace('ź', 'z');
  NameFile = NameFile.replace('Ź', 'z');
  NameFile = NameFile.replace('Ć', 'c');
  NameFile = NameFile.replace('ć', 'c');
  NameFile = NameFile.replace('ę', 'e');
  NameFile = NameFile.replace('Ę', 'e');
  NameFile = NameFile.replace('Ś', 's');
  NameFile = NameFile.replace('ś', 's');
  return NameFile;
};

const toUrl = value =>
  removeSpecial(
    encodeURIComponent(value)
      .replace(/%20/g, '-')
      .toLowerCase(),
  );

const path = require(`path`);

const makeRequest = (graphql, request) =>
  new Promise((resolve, reject) => {
    // Query for article nodes to use in creating pages.
    resolve(
      graphql(request).then(result => {
        if (result.errors) {
          reject(result.errors);
        }

        return result;
      }),
    );
  });

exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators;

  const getArticles = makeRequest(
    graphql,
    `
{
  strapi {
    categories {
      id
      slug
      name
    }
  }
}
    `,
  ).then(result => {
    result.data.strapi.categories.forEach(({ id, slug }) => {
      createPage({
        path: `/${slug}`,
        component: path.resolve(`src/templates/category.tsx`),
        context: {
          id,
        },
      });
    });
  });

  // Const getAuthors = makeRequest(
  //   graphql,
  //   `
  //   {
  //     allStrapiUser {
  //       edges {
  //         node {
  //           id
  //         }
  //       }
  //     }
  //   }
  //   `,
  // ).then(result => {
  //   // Create pages for each user.
  //   result.data.allStrapiUser.edges.forEach(({ node }) => {
  //     createPage({
  //       path: `/authors/${node.id}`,
  //       component: path.resolve(`src/templates/author.tsx`),
  //       context: {
  //         id: node.id,
  //       },
  //     });
  //   });
  // });

  // Queries for articles and authors nodes to use in creating pages.
  return Promise.all([getArticles]);
};
