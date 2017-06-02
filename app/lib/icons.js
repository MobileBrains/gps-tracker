(function() {
    var keys = [];

    keys.push({name: 'icon_name', code: 0xfe60f});

    keys.forEach(function(icon) {
        exports[icon.name] = String.fromCharCode(icon.code);
    });
})();