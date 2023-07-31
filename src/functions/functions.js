

//get total items in collection
// async function getQuantity(model) {
//     const quant = await model.countDocuments().exec()

//     return quant
// }

//------------------------------//
    //------------------------------//

    //check if any key in new product is empty
    function checkIfEmpty(object) {
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                if (object[key].length === 0) {
                    return true
                }

            }
        }
    }



module.exports = checkIfEmpty
// module.exports = getQuantity
