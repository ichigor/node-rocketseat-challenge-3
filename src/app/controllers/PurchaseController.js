const Ad = require('../models/Ad')
const User = require('../models/User')
const PurchaseMail = require('../jobs/PurchaseMail')
const Queue = require('../services/Queue')
const Purchase = require('../models/Purchase')

class PurchaseController {
  async store (req, res) {
    const { ad, content } = req.body

    const purchaseAd = await Ad.findById(ad).populate('author')
    const user = await User.findById(req.userId)

    const purchase = await Purchase.create({ ad, user: user._id })

    Queue.create(PurchaseMail.key, {
      ad: purchaseAd,
      user,
      content
    }).save()

    return res.json(purchase)
  }

  async update (req, res) {
    const { id } = req.params

    const { ad } = await Purchase.findById(id).populate({
      path: 'ad',
      populate: {
        path: 'author'
      }
    })

    if (ad.purchasedBy) {
      return res
        .status(400)
        .json({ error: 'This ad had already been purchased' })
    }

    ad.purchasedBy = id

    await ad.save()

    return res.json(ad)
  }

  async show (req, res) {
    const purchase = await Purchase.findById(req.params.id)

    return res.json(purchase)
  }
}

module.exports = new PurchaseController()
