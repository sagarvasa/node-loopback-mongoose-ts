import { IVendorBaseDocument, IVendorBaseModel, IVendorPopulatedDocument } from '../types/vendor-data';
import VendorDataModel from '../models/vendor-data.model';

export class VendorDataRepository {
  constructor(/* Add @inject to inject parameters */) {}

  async findVendorByEmail(email: string) {
    return VendorDataModel.findOne({ email });
  }

  async createVendorData(body: IVendorPopulatedDocument) {
    let model = new VendorDataModel(body);
    return model.save();
  }

  async updateVendorById(id: string, body: object) {
    return VendorDataModel.findByIdAndUpdate(id, body, { new: true });
  }
}
