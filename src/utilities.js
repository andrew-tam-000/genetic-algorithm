const _ = require('lodash');

// UTILTIIES
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function toNumber(number) {
    return +number;
}

function doStringMate(str1, str2) {
    const maxPivot = Math.min(_.size(str1), _.size(str2));
    const pivot = getRandomInt(0, maxPivot);

    function joinMates(pivot, str1, str2) {
        return _.join(
            _.concat(
                str1.slice(
                    0,
                    pivot
                ),
                str2.slice(
                    pivot
                )
            ),
            ''
        )
    }

    return [
        joinMates(pivot, str1, str2),
        joinMates(pivot, str2, str1)
    ];
}


module.exports = {
    getRandomInt,
    toNumber,
    doStringMate
}
