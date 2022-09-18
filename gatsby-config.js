require("dotenv").config();

module.exports = {
    siteMetadata: {
        title: ``,
        description: ``,
        author: ``,
    },
    plugins: [
        `gatsby-plugin-react-helmet`,
        {
            resolve: "gatsby-plugin-no-sourcemaps",
            options: {
                name: `images`,
                path: `${__dirname}/src/images`,
            },
        },
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: `gatsby-starter-default`,
                short_name: `starter`,
                start_url: `/`,
                background_color: `#663399`,
                theme_color: `#663399`,
                display: `minimal-ui`,
                icon: `src/images/favicon.png`, // This path is relative to the root of the site.
            },
        },
        `gatsby-plugin-sass`,
        `gatsby-plugin-typescript`,
        `gatsby-plugin-no-sourcemaps`,
    ],
};
