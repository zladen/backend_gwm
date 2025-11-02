import { Injectable } from '@nestjs/common';
import { CreateLocationInput } from './dto/create-location.input';
import { UpdateLocationInput } from './dto/update-location.input';
import { Model, Schema as MongooSchema } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Location, LocationDocument } from './entities/location.entity';

@Injectable()
export class LocationService {
	constructor(
		@InjectModel(Location.name)
		private locationModel: Model<LocationDocument>,
	) {}

	getLocationById(id: MongooSchema.Types.ObjectId) {
		return this.locationModel.findById(id);
	}

	createLocation(createLocationInput: CreateLocationInput) {
		const createLocation = new this.locationModel(createLocationInput);
		return createLocation.save();
	}

	updateLocation(
		id: MongooSchema.Types.ObjectId,
		updateLocationInput: UpdateLocationInput,
	) {
		return this.locationModel.findByIdAndUpdate(id, updateLocationInput, {
			new: true,
		});
	}

	removeLocation(id: MongooSchema.Types.ObjectId) {
		return this.locationModel.deleteOne({ _id: id });
	}
}
