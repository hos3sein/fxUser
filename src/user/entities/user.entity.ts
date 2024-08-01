import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { Document } from 'mongoose';

// here i make the interface for user
export interface userInterFace extends Document{
    readonly role: number;
    readonly email: string;
    readonly password: string;
    readonly code: number;
    readonly autoExpand: boolean;
    readonly suspend: boolean;
    readonly username: string;
    readonly subScriber: [],
    readonly wallet : string,
    readonly region : string,
    readonly profile : string,
    readonly level : number,
    readonly subScriberFee : number
}
   

@Schema({timestamps : true})  
export class Student {
//    @Prop()   
//    name: string;   
   @Prop()
   email: string;

   @Prop()
   password: string;

   @Prop()  
   refreshToken: string;


   @Prop({type : Number})
   role: number;                    // 0 : base user   // 1: complete user // 2 : base leader // 3 : approved leader

   @Prop({type : Number})
   status: number;         //  0 : just init   // 1: complete register  

   @Prop()
   code: number;

   @Prop({type : Boolean , default : false})
   usingCode : boolean;


   @Prop()
   firstName: string ;
   
   @Prop()
   lastName: string;

   @Prop()
   wallet: string;
   
   @Prop()
   Vwallet: string;

   @Prop()
   profile: string;

   @Prop()
   username: string;

   @Prop({default : false , type : Boolean})
   approve: boolean;

   @Prop({default : false , type : Boolean})
   suspend: boolean;

   @Prop()
   subScriber : [{userId : string , createTime : string}];

   @Prop()
   subScribing: [string];

   @Prop()
   followers: [{id : string}];

   @Prop()
   followings: [{id : string}];
  
   @Prop()  
   gender: string;
  
 
   @Prop()
   age: number;

   @Prop()
   region: string;

   @Prop()
   tellegramId: string;

   @Prop()
   points:number;

   @Prop()
   ticket: string;

   
    @Prop({type : String  , default : null})
    broker : [string]

   @Prop()
   history: [{_id : string}];

   @Prop()
   seenSignals: [string];

   @Prop({type : String , default : null})
   resetPasswordToken: string;     
   
   @Prop({type : String , default : null})
   resetTokenExpire: string;

   @Prop()
   leaders : [string];   

   @Prop({type : Boolean , default : false})
   autoExpand : boolean

   @Prop({default : []})
   discount : [{status : number , discount : number , active : boolean}]   //status => 0 : 1 month    // 1 : two month   // 2 : 3 month

    @Prop({type : Number , default : 0})
    level : number                       // status => 0:

    @Prop({type : Boolean})
    Active : boolean


    @Prop({type : Number})
    subScriberFee : number
}

export const UserSchema = SchemaFactory.createForClass(Student);