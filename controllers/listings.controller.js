const Listing = require('../models/listing')

const index = async (req, res) => {
    try {
    const listings = await Listing.find().populate('owner')
    // console.log(listings)
    res.render('listings/index.ejs', {
        title: 'Listing',
        listings
    })
    } catch (error) {
    console.log(error)
    res.redirect('/')
}}

const newListing = (req, res) => {
    res.render('listings/new.ejs', {
        title: 'Add a Listing'
    })
}

const createListing = async (req, res) => {
    try {
    req.body.owner = req.session.user._id
    await Listing.create(req.body)
    res.redirect('/listings')
    } catch (error) {
    console.log(error)
}
}

const show = async (req, res) => {
    try {
        // console.log('Show: ', req.params.listingId)
        const listing = await Listing.findById(req.params.listingId).populate('owner')

        const userHasFavorited = listing.favoritedByUsers.some((user) => user.equals(req.session.user._id))

        // console.log(listing)
        res.render('listings/show.ejs', {
            title: listing.streetAddress,
            listing,
            userHasFavorited,
        })

    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

const deleteListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.listingId)

        // Check if signed in user and listung owner match
        if (listing.owner.equals(req.params.userId)) {
            await listing.deleteOne() // Deletes the listing
            res.redirect('/listings')
        } else {
            res.send('You do not have a permission to do that.') // If owner and listing ID does not match, send this message.
        }
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

const editListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.listingId).populate('owner')
        // console.log(listing)
        res.render('listings/edit.ejs', {
            title: `Edit ${listing.streetAddress}`,
            listing
        })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

const updateListing = async (req, res) => {
    try {
        const listing = await Listing.findByIdAndUpdate(
            req.params.listingId,
            req.body,
            {new: true}
        )
        res.redirect(`/listings/${listing._id}`)
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

const addFavorite = async (req, res) => {
    try {
        const listing = await Listing.findByIdAndUpdate(req.params.listingId, {
            $push: { favoritedByUsers: req.params.userId}
        })

        res.redirect(`/listings/${listing._id}`)

    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

const removeFavorite = async (req, res) => {
    try {
        const listing = await Listing.findByIdAndUpdate(req.params.listingId, {
            $pull: { favoritedByUsers: req.params.userId}
        })

        res.redirect(`/listings/${listing._id}`)

    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

module.exports = {
    index,
    newListing,
    createListing,
    show,
    deleteListing,
    editListing,
    updateListing,
    addFavorite,
    removeFavorite,
}