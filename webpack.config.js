const path = require('path');
const Dotenv = require('dotenv-webpack');
module.exports = [
    {
        mode: 'production',
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
        },
        optimization: {
            mergeDuplicateChunks: true, // Tells webpack to merge chunks which contain the same modules.
            //minimize: true, // Tell webpack to minimize the bundle using the TerserPlugin
            providedExports: true, // Tells webpack to figure out which exports are provided by modules to generate more efficient code for export * from ...
            removeAvailableModules: true, // Tells webpack to detect and remove modules from chunks when these modules are already included in all parents.
            usedExports: true, // <- remove unused function
        }
    },
    {
        mode: 'production',
        entry: './src/client/initialize.ts',
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
            filename: 'initialize.js',
            path: path.resolve(__dirname, 'public/assets/scripts')
        },
        optimization: {
            mergeDuplicateChunks: true, // Tells webpack to merge chunks which contain the same modules.
            //minimize: true, // Tell webpack to minimize the bundle using the TerserPlugin
            providedExports: true, // Tells webpack to figure out which exports are provided by modules to generate more efficient code for export * from ...
            removeAvailableModules: true, // Tells webpack to detect and remove modules from chunks when these modules are already included in all parents.
            usedExports: true, // <- remove unused function
        }
    }
];