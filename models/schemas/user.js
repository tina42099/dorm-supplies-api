const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
	email: { type: String, unique: true },
	hash: String,
	name: String,
	isAdmin: Boolean,
	address: String,
  classYear: Number,
  orders: [{
    	items: [{
      		itemId: String,
      		quantity: Number,
      		price: Number,
   		}],
    	purchasedDate: Date,
    	deliveredDate: Date,
    	isPaid: Boolean
  }]
},
{
	toObject: { getter:true },
	timestamps: {
		createdAt: 'createdDate',
		updatedAt: 'updatedDate'
  },
}
);

const User = mongoose.model('User', userSchema);

module.exports = User;