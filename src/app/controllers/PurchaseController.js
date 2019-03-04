const Ad = require('../models/Ad')
const User = require('../models/User')
const Mail = require('../services/Mail')

class PurchaseController {
  async store (req, res) {
    const { ad, content } = req.body

    const purchaseAd = await Ad.findById(ad).populate('author')
    const user = await User.findById(req.userId)

    await Mail.sendMail({
      from: '"Igor Moiano" <igor.moiano@hotmail.com>',
      to: purchaseAd.author.email,
      subject: `Solicitacao de compra: ${purchaseAd.title}`,
      template: 'purchase',
      context: { user, content, ad: purchaseAd }
      // html: `<p>teste: ${user} ${purchaseAd} ${content} </p>`
    })

    return res.send()
  }
}

module.exports = new PurchaseController()
