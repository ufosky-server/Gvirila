function Languages () {

    var languages = {
        de: Languages_de_Terms,
        en: Languages_en_Terms,
        ka: Languages_ka_Terms,
    }

    for (var i in languages) {
        languages[i] = { terms: languages[i]() }
    }

    return languages

}
