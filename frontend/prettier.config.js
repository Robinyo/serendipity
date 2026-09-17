module.exports = {
    printWidth: 120,
    singleQuote: true,
    overrides: [
        {
            files: '*.html',
            options: {
                parser: 'angular',
            },
        },
    ],
};