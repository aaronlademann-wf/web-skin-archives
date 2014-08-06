module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sed: {
            relativeUrls: {
                pattern: /\.\.\/archives\//g,
                replacement: '../../',
                recursive: true
            },
            relativeUrlsHome: {
                pattern: /\.\/archives\//g,
                replacement: '../',
                recursive: true
            },
        },
    });

    grunt.loadNpmTasks('grunt-sed');

    grunt.registerTask('default', ['sed']);
};