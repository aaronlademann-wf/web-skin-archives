module.exports = function(grunt) {
    var specialArchiveCSS = grunt.file.read('./lib/css/archives-header-stamp.css');

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
            addSpecialArchiveCSS: {
                pattern: /(docs\.css\?*(.*)\" rel=\"stylesheet\"\>)/g,
                replacement: '$1\n<style>\n' + specialArchiveCSS + '\n</style>',
                recursive: true
            }
        },
    });

    grunt.loadNpmTasks('grunt-sed');

    grunt.registerTask('default', ['sed']);
};