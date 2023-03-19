export default {
    include: ['dist/tests/**/*.js', 'dist/test/**/*.js'],
    verbose: true,
    timeout: 1000,

    watch: true,
    files: ['dist'],

    parallel: false,
    workers: 0,
}
