const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review.js")
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    url:String,
    filename:String,
    // filename: { type: String },
    // url: {
    //   type: String,
    //   default:
    //     "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWx8ZW58MHx8MHx8fDA%3D",
    //   set: (v) =>
    //     v === ""
    //       ? "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWx8ZW58MHx8MHx8fDA%3D"
    //       : v,
    // },
  },
  description: String,
  price: Number,
  location: String,
  country: String,
  reviews :[
    {
      type:Schema.Types.ObjectId,
      ref:"Review",
    }
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      
    },
    coordinates: {
      type: [Number],
      
    }
  },
  category: {
    type: String,
    enum: ['Trending','Room','Iconic Cities','Mountains','Castles','Amazing Pools','Camping',"Farms","Arctic","Domes","Boats","Others"],
  },
});

listingSchema.post("findOneAndDelete" , async(listing)=>{
  if(listing){
    await Review.deleteMany({_id :{$in : listing.reviews}});
  }
 
});

module.exports = mongoose.model('Listing', listingSchema);
