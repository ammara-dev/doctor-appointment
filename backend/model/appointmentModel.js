import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    userId : {type : String, requried : true},
    docId : {type : String, requried : true},
    slotDate : {type : String, requried : true},
    slotTime : {type : String, requried : true},
    payment: {type : Boolean, default : false},
    cancelled : {type : Boolean, default : false},
    isCompleted : {type : Boolean, default : false},
    userData : {type : Object, requried : true},
    docData : {type : Object, requried : true},
    date : {type : Number, requried : true},
    amount : {type : Number, requried : true},
})

const appointmentModel = mongoose.model('appointment', appointmentSchema) || mongoose.models.appointment;

export default appointmentModel;