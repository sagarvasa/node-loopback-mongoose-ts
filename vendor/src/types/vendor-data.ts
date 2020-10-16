import { Document, Model } from 'mongoose';

export interface IVendorDocument {
  name: string;
  email: string;
  phoneNumber: number;
  company: string;
  jobTitle: string;
}

export interface IVendorPopulatedDocument extends IVendorDocument {
  emailStatus: EmailStatus;
  accountStatus: AccountStatus;
  isActive: boolean;
  isPhoneVerified: boolean;
  vendorQuery?: string | null;
  isAdminContacted: boolean;
  contactDate?: Date | null;
}

export interface IVendorBaseDocument extends IVendorPopulatedDocument, Document {
  //mongoose virtuals and instance method
}

export interface IVendorBaseModel extends Model<IVendorBaseDocument> {
  // static model on mongoose model
}

export enum EmailStatus {
  PENDING = 'Pending',
  AUTHORIZED = 'Authorized',
  UNAUTHORIZED = 'Unauthorized',
  SENT_FOR_AUTHORIZATION = 'Sent for Authorization',
}

export enum AccountStatus {
  UNKNOWN = 'Unknown',
  PENDING = 'Pending',
  SENT_FOR_AUTHORIZATION = 'Sent for Authorization',
  RECHECK = 'Recheck',
  DISCARD = 'Discard',
  APPROVED = 'Approved',
}
