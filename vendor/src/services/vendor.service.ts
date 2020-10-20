import { injectable, /* inject, */ BindingScope } from '@loopback/core';
import { repository } from '@loopback/repository';
import { VendorDataRepository } from '../repositories';
import { IVendorDocument, IVendorPopulatedDocument, EmailStatus, AccountStatus } from '../types/vendor-data';
import logger from '../utilities/winston';

@injectable({ scope: BindingScope.TRANSIENT })
export class VendorService {
  constructor(@repository(VendorDataRepository) public vendorDataRepository: VendorDataRepository) {}

  async checkEmailStatus(email: string) {
    try {
      const vendorData = await this.vendorDataRepository.findVendorByEmail(email);
      const response = {
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
        vendorData?.accountStatus !== AccountStatus.APPROVED &&
        vendorData?.emailStatus === EmailStatus.AUTHORIZED
      ) {
        response['action'] = 'PASSWORD';
      } else if (
        vendorData?.accountStatus !== AccountStatus.APPROVED &&
        vendorData?.emailStatus !== EmailStatus.AUTHORIZED
      ) {
        response['action'] = 'OTP';
      }
      return response;
    } catch (error) {
      logger.put('Error in checkEmailStatus ' + error.message);
    }
  }

  async createVendorProfile(body: IVendorDocument) {
    try {
      const VendorData: IVendorPopulatedDocument = {
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

      const createdVendor = await this.vendorDataRepository.createVendorData(VendorData);
      return createdVendor;
    } catch (error) {
      logger.put('Error in checkEmailStatus ' + error.message);
    }
  }

  async updateVendorQuery(id: string, query: string) {
    try {
      const body = {
        vendorQuery: query,
      };
      const updatedVendor = await this.vendorDataRepository.updateVendorById(id, body);
      return updatedVendor;
    } catch (error) {
      logger.put('Error in checkEmailStatus ' + error.message);
    }
  }
}
