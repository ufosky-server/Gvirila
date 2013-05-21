function RemoteAPI () {
    return {
        createFolder: function (path, callback) {
            var xhr = UrlencodedXHR('api/create-folder.php', callback)
            xhr.send(
                QueryString({ path: path })
            )
        },
        createNetworkFolder: function (path, host, username, password, callback) {
            var xhr = UrlencodedXHR('api/create-network-folder.php', callback)
            xhr.send(
                QueryString({
                    path: path,
                    host: host,
                    username: username,
                    password: password,
                })
            )
        },
        deleteFilesAndFolders: function (files, folders, callback) {
            var xhr = UrlencodedXHR('api/delete-files-and-folders.php', callback)
            xhr.send(
                QueryString({
                    files: files,
                    folders: folders,
                })
            )
        },
        directoryIndex: function (path, callback) {
            var xhr = UrlencodedXHR('api/directory-index.php', callback)
            xhr.send(
                QueryString({ path: path })
            )
        },
        exportAndSend: function (email, callback) {
            var xhr = UrlencodedXHR('api/export-and-send.php', callback)
            xhr.send(
                QueryString({ email: email })
            )
        },
        getFile: function (path, callback) {
            var xhr = UrlencodedXHR('api/get-file.php', callback)
            xhr.send(
                QueryString({ path: path })
            )
        },
        importSession: function (sessionFile, callback) {
            var formData = new FormData
            formData.append('file', sessionFile)
            var xhr = XHR('api/import-session.php', callback)
            xhr.send(formData)
        },
        latestVersion: function (callback) {
            var xhr = UrlencodedXHR('api/latest-version.php', callback)
            xhr.send()
        },
        localVersion: function (callback) {
            var xhr = UrlencodedXHR('api/local-version.php', callback)
            xhr.send()
        },
        putFile: function (config) {
            var xhr = UrlencodedXHR('api/put-file.php', config.callback)
            xhr.send(
                QueryString({
                    path: config.path,
                    content: config.content,
                    mtime: config.mtime,
                    overwrite: config.overwrite,
                })
            )
        },
        rename: function (path, name, callback) {
            var xhr = UrlencodedXHR('api/rename.php', callback)
            xhr.send(
                QueryString({
                    path: path,
                    name: name,
                })
            )
        },
        resetSession: function (callback) {
            UrlencodedXHR('api/reset-session.php', callback).send()
        },
        searchFiles: function (path, name, content, callback) {
            var xhr = UrlencodedXHR('api/search-files.php', callback)
            xhr.send(
                QueryString({
                    path: path,
                    name: name,
                    content: content,
                })
            )
        },
        wake: function () {
            UrlencodedXHR('api/wake.php').send()
        },
    }
}
