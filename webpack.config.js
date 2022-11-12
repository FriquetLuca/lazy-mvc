const path = require('path');
const Dotenv = require('dotenv-webpack');
module.exports = [
    {
        mode: 'development',
        entry: './src/client/main.ts',
        module: {
            rules: [
                {
                    test: /\.ts$/, // File must end with .ts
                    use: 'ts-loader',
                    include: [path.resolve(__dirname, 'src/client/')]
                }
            ]
        },
        plugins: [
            new Dotenv()
        ],
        resolve: {
            extensions: ['.ts', '.js']
        },
        output: {
            publicPath: 'public/assets/scripts',
            filename: 'main.js',
            path: path.resolve(__dirname, 'public/assets/scripts')
        }
    }
];