const path = require('path');

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
            return webpackConfig;
        },
    },
};
