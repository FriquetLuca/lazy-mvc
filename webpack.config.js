const path = require('path');

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