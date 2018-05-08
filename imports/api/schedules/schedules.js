import SimpleSchema from 'simpl-schema';
import {Mongo} from 'meteor/mongo';

export const Schedules = new Mongo.Collection('schedules');

Schedules.schema = new SimpleSchema({
  start: {
    type: String,
    max:30
  },
  end:{
    type : String,
    max:30
  },
  days:{
    type : String,
    max:100
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

Schedules.attachSchema(Schedules.schema);
