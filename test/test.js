var traceur = require("traceur");

traceur.require.makeDefault(function(filename) {
    // don't transpile our dependencies, just our app
    return filename.indexOf("node_modules") === -1;
});

["code-points", "strings"].map(function(file) {
    return "./" + file + ".es";
}).forEach(require);
