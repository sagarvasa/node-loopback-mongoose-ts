import { injectable, /* inject, */ BindingScope } from '@loopback/core';
import { repository } from '@loopback/repository';
import { VendorDataRepository } from '../repositories';
import { IVendorDocument, IVendorPopulatedDocument, EmailStatus, AccountStatus } from '../types/vendor-data';

@injectable({ scope: BindingScope.TRANSIENT })
export class VendorService {
  constructor(@repository(VendorDataRepository) public vendorDataRepository: VendorDataRepository) {}

  async checkEmailStatus(email: string) {
    let vendorData = await this.vendorDataRepository.findVendorByEmail(email);
    let response = {
      email,
      action: 'OTP',
    };
    if (!vendorData) {
      response['action'] = 'ONBOARD';
    } else if (
      vendorData?.accountStatus === AccountStatus.APPROVED &&
      vendorData?.emailStatus === EmailStatus.AUTHORIZED
    ) {
      response['action'] = 'DASHBOARD';
    } else if (
      vendorData?.accountStatus != AccountStatus.APPROVED &&
      vendorData?.emailStatus === EmailStatus.AUTHORIZED
    ) {
      response['action'] = 'PASSWORD';
    } else if (
      vendorData?.accountStatus != AccountStatus.APPROVED &&
      vendorData?.emailStatus != EmailStatus.AUTHORIZED
    ) {
      response['action'] = 'OTP';
    }
    return response;
  }

  async createVendorProfile(body: IVendorDocument) {
    let VendorData: IVendorPopulatedDocument = {
      name: body['name'],
      email: body['email'],
      phoneNumber: body['phoneNumber'],
      company: body['company'],
      jobTitle: body['jobTitle'],
      emailStatus: EmailStatus.PENDING,
      accountStatus: AccountStatus.UNKNOWN,
      isActive: true,
      isPhoneVerified: false,
      isAdminContacted: false,
      vendorQuery: null,
      contactDate: null,
    };

    let createdVendor = await this.vendorDataRepository.createVendorData(VendorData);
    return createdVendor;
  }

  async updateVendorQuery(id: string, query: string) {
    let body = {
      vendorQuery: query,
    };
    let updatedVendor = await this.vendorDataRepository.updateVendorById(id, body);
    return updatedVendor;
  }
}
