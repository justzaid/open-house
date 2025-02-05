const Listing = require('../models/listing')

const index = async (req, res) => {
    try {
    const listings = await Listing.find()
    console.log(listings)
    res.render('listings/index.ejs', {
        title: 'Listing',
    })
    } catch (error) {
    console.log(error)
    res.redirect('/')
}}

module.exports = {
    index,
}