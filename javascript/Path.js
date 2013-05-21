var Path = {
    dirname: function (path) {
        return path.replace(/^((.*)\/)?.*$/, '$2')
    },
    join: function (path1, path2) {
        return path1 + (path1 ? '/' : '') + path2
    },
}
