module.exports = {
    printWidth: 120,
    singleQuote: false,
    overrides: [
        {
            files: '*.html',
            options: {
                parser: 'angular',
            },
        },
    ],
};
