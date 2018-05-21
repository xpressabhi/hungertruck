import SimpleSchema from 'simpl-schema';
import {Mongo} from 'meteor/mongo';

export const Trucks = new Mongo.Collection('trucks');

Trucks.schema = new SimpleSchema({
  name: {
    type: String,
    max:300
  },
  mobile:{
    type : String,
    max:20
  },
  address:{
    type : String,
    max:500
  },
  category:{
    type:String
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset(); // Prevent user from supplying their own value
      }
    }
  },
  userId: {
    type: String,
    autoValue: function() {
      if (this.isInsert) {
        return this.userId;
      } else if (this.isUpsert) {
        return {$setOnInsert: this.userId};
      } else {
        if (Roles.userIsInRole(this.userId, 'admin')) {
          // allowing edit of user id
        } else {
          this.unset(); // Prevent user from supplying their own value
        }

      }
    }
  }
});

Trucks.attachSchema(Trucks.schema);
