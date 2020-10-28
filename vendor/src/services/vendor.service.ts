import { Response } from '@loopback/rest';
import { injectable, /* inject, */ BindingScope } from '@loopback/core';
import { repository } from '@loopback/repository';
import { VendorDataRepository } from '../repositories';
import { IVendorDocument, IVendorPopulatedDocument, EmailStatus, AccountStatus } from '../types/vendor-data';
import logger from '../utilities/winston';
import { ErrorConst, CustomError } from '../utilities/errors';

@injectable({ scope: BindingScope.TRANSIENT })
export class VendorService {
  constructor(@repository(VendorDataRepository) public vendorDataRepository: VendorDataRepository) {}

  async checkEmailStatus(email: string, res: Response) {
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
      logger.put('[services][checkEmailStatus][err] ' + error.message, res);
      throw new CustomError(
        Number(error.status) || ErrorConst.INTERNAL_SERVER_ERROR,
        error.message || ErrorConst.GENERAL_ERROR_MSG,
      );
    }
  }

  async createVendorProfile(body: IVendorDocument, res: Response) {
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
      logger.put('[services][createSellerProfile][err] ' + error.message, res);
      throw new CustomError(
        Number(error.status) || ErrorConst.INTERNAL_SERVER_ERROR,
        error.message || ErrorConst.GENERAL_ERROR_MSG,
      );
    }
  }

  async updateVendorQuery(id: string, query: string, res: Response) {
    try {
      const body = {
        vendorQuery: query,
      };
      const updatedVendor = await this.vendorDataRepository.updateVendorById(id, body);
      return updatedVendor;
    } catch (error) {
      logger.put('[services][updateVendorQuery][err] ' + error.message, res);
      throw new CustomError(
        Number(error.status) || ErrorConst.INTERNAL_SERVER_ERROR,
        error.message || ErrorConst.GENERAL_ERROR_MSG,
      );
    }
  }
}
