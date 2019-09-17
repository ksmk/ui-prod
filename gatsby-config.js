require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  siteMetadata: {
    title: `umawiajonline.pl`,
    description: 'desc',

    googleVerification: `abcdefz`,
    disqus: `gatsby-typescript`,
    siteUrl: `http://localhost:1337`,
  },
  mapping: {
    'MarkdownRemark.frontmatter.author': `AuthorJson`,
  },
  plugins: [
    `gatsby-plugin-sass`,
    // Expose `/data` to graphQL layer
    `gatsby-plugin-react-helmet`,

    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/assets/images`,
      },
    },

    {
      resolve: 'gatsby-source-graphql',
      options: {
        // This type will contain remote schema Query type
        typeName: 'STRAPI',
        // This is field under which it's accessible
        fieldName: 'strapi',
        // Url to query from
        url: process.env.GRAPHQL,
      },
    },

    // {
    //   resolve: `gatsby-source-strapi`,
    //   options: {
    //     apiURL: `http://localhost:8081`,
    //     contentTypes: [
    //       `article`,
    //       `user`,
    //       `business`,
    //       `scheduleholiday`,
    //       `city`,
    //       `district`,
    //       `order`,
    //       `provider`,
    //       `owner`,
    //       `service`,
    //       `category`,
    //     ],
    //     queryLimit: 1000,
    //   },
    // },

    {
      resolve: `gatsby-plugin-s3`,
      options: {
        bucketName: 'umawiajonline.pl',
        protocol: 'http',
        hostname: 'umawiajonline.pl',
        region: '',
        options: {
          bucketName: 'umawiajonline.pl',
          acl: null,
        },
      },
    },

    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'UA-134416281-1',
        // Puts tracking script in the head instead of the body
        head: false,
        // Setting this parameter is optional
        anonymize: true,
        // Setting this parameter is also optional
        respectDNT: true,
      },
    },

    {
      resolve: `gatsby-plugin-prefetch-google-fonts`,
      options: {
        fonts: [
          {
            family: `Montserrat`,
            subsets: [`latin-ext`],
            variants: [
              `100`,
              `200`,
              `300`,
              `400`,
              `500`,
              `600`,
              `700`,
              `800`,
              `900`,
            ],
          },
        ],
      },
    },

    // Parse all markdown files (each plugin add/parse some data into graphQL layer)
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 690,
              backgroundColor: `#f7f0eb`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-autolink-headers`,
        ],
      },
    },

    // Parse all images files
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,

    // Parse JSON files
    `gatsby-transformer-json`,

    // Add typescript stack into webpack
    `gatsby-plugin-typescript`,

    // This plugin takes your configuration and generates a
    // web manifest file so your website can be added to your
    // homescreen on Android.
    /* eslint-disable camelcase */
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Gatsby website`,
        short_name: `Gatsby website`,
        start_url: `/`,
        background_color: `#f7f7f7`,
        theme_color: `#191919`,
        display: `minimal-ui`,
      },
    },

    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl: `http://localhost:1337`,
      },
    },
    /* eslint-enable camelcase */

    // This plugin generates a service worker and AppShell
    // html file so the site works offline and is otherwise
    // resistant to bad networks. Works with almost any
    // site!
    // `gatsby-plugin-offline`,
    `gatsby-plugin-styled-components`,
    // `gatsby-plugin-modal-routing`
    `gatsby-plugin-sitemap`,
  ],
};
