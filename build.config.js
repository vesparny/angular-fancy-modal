'use strict';

module.exports = {
  port: 3000,
  dist: 'dist',
  scss: 'lib/*.scss',
  js: 'lib/*.js',
  banner: ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @author <%= pkg.author %>',
    ' * @url <%= pkg.url %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''
  ].join('\n')
};
