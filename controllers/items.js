const Item = require('../models/schemas/item')
const User = require('../models/schemas/user')

// Gets all items from db where quantity > 0
exports.getAvailableItems = (req, res, next) => {
    Item.find({
      $and: [
        { quantity: { $exists: true } },
        { quantity: { $gt: 0 } }
      ]
    })
}

// Gets user and item specified in req.params and return user and item specified
exports.purchaseItem = (req, res, next) => {
    let ret = {}
    if (!req.body.quantity || req.body.quantity < 0) return res.status(404).send('Must enter valid quantity')
    Item.findById(req.params.itemId, (err, item) => {
      if (err) return next(err)
      if(!item) return res.status(404).send('No item with id: ' + req.params.itemId)
      if (item.quantity < req.body.quantity) return res.status(404).send('Not enough available items to purchase')
      item.quantity -= req.body.quantity
      ret.item = item
      let newOrder = {
        items: [{
          itemId: req.params.itemId,
          quantity: req.body.quantity,
          price: req.body.price,
        }],
          purchasedDate: new Date(),
          isPaid: false
      }
      User.findOneAndUpdate({ _id: req.params.userId }, { $push: { orders: newOrder } }, { safe: true, upsert: true }, (err, user) => {
        if (err) return next(err)
        if(!user) return res.status(404).send('No user with id: ' + req.params.userId)
        ret.user = user
        return res.json(ret)
      })
    })
}

/*
* C.R.U.D. Controllers
*/

exports.createItem = (req, res, next) => {
    if (!req.body.name) {
  	  return res.status(400).send('Must provide name')
  	}
 	  if (!req.body.price) {
    	return res.status(400).send('Must provide price')
  	}
    if (!req.body.quantity) {
      return res.status(400).send('Must provide quantity')
    }
  	const itemData = {
    	 name: req.body.name,
    	 price: req.body.price,
       description: req.body.description,
       quantity: req.body.quantity,
       pic: req.body.pic
  	}
  	const newItem = new Item(itemData)
  	newItem.save((err) => {
    	if (err) return next(err)
    	return res.json(newItem)
  	})
}

exports.getAllItems = (req, res, next) => {
 	  Item.find({}, (err, items) => {
    	if (err) return next(err)
      return res.json(items)
    })
}

exports.getItemById = (req, res, next) => {
  	Item.findById(req.params.itemId, (err, item) => {
  		if (err) return next(err)
  		if(!item) return res.status(404).send('No item with id: ' + req.params.itemId)
      return res.json(item)
    })
}

exports.updateItem = (req, res, next) => {
  	Item.findOneAndUpdate({ _id: req.params.itemId }, req.body, {}, (err, item) => {
  		if (err) return next(err)
  		if(!item) return res.status(404).send('No item with id: ' + req.params.itemId) 
      return res.json(item)	
  	})
    
}

exports.deleteItem = (req, res, next) => {
    Item.findByIdAndRemove(req.params.itemId, (err, item) => {
  		if (err) return next(err)
  		if(!item) return res.status(404).send('No item with id: ' + req.params.itemId)
      	return res.json(item)
	})
}
