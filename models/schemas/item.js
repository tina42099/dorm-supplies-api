const mongoose = require('mongoose');
const Schema = mongoose.Schema

const itemSchema = new Schema({
	name: String,
	price: Number,
  	description: String,
  	quantity: Number,
  	pic: String
},
{
	toObject: { getter:true },
	timestamps: {
		createdAt: 'createdDate',
		updatedAt: 'updatedDate'
	},
})

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;