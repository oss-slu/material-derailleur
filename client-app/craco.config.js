const path = require('path');
const webpack = require('webpack');

module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            // react-router v7 uses nested package.json "exports" conditions that
            // CRA's webpack 5 config cannot traverse. Map the subpath directly.
            webpackConfig.resolve.alias = {
                ...webpackConfig.resolve.alias,
                'react-router/dom': path.resolve(
                    __dirname,
                    'node_modules/react-router/dist/development/dom-export.js'
                ),
            };

            // Suppress "Critical dependency: the request of a dependency is an expression"
            // warnings from react-router's dynamic requires using ContextReplacementPlugin
            webpackConfig.plugins.push(
                new webpack.ContextReplacementPlugin(
                    /react-router/,
                    (context) => {
                        // Ignore warnings for react-router dynamic requires
                        return context;
                    }
                )
            );

            return webpackConfig;
        },
    },
};
