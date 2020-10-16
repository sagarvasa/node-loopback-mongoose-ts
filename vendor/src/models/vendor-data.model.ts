import { Schema, model } from 'mongoose';
import { IVendorBaseModel, IVendorBaseDocument, EmailStatus, AccountStatus } from '../types';

const VendorDataSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    emailStatus: {
      type: String,
      enum: Object.values(EmailStatus),
      required: true,
    },
    accountStatus: {
      type: String,
      enum: Object.values(AccountStatus),
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    isPhoneVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    vendorQuery: {
      type: String,
      required: false,
    },
    isAdminContacted: {
      type: Boolean,
      required: true,
      default: false,
    },
    contactDate: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true, strict: true },
);

const VendorDataModel = model<IVendorBaseDocument, IVendorBaseModel>('VendorDataModel', VendorDataSchema, 'VendorData');
export default VendorDataModel;
