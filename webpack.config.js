const path = require('path');

module.exports = {
    entry: './src/index.js', // Entry point of your application
    output: {
        path: path.resolve(__dirname, 'dist'), // Output directory
        filename: 'bundle.js', // Output filename
    },
    module: {
        rules: [
            {
                test: /\.js$/, // Apply loader to .js files
                exclude: /node_modules/, // Exclude node_modules directory
                use: {
                    loader: 'babel-loader', // Use babel-loader for transpiling JavaScript files
                    options: {
                        presets: ['@babel/preset-env'], // Use @babel/preset-env for compiling modern JavaScript
                    },
                },
            },
        ],
    },
};
