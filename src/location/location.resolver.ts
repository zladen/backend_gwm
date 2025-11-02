import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { LocationService } from './location.service';
import { CreateLocationInput } from './dto/create-location.input';
import { UpdateLocationInput } from './dto/update-location.input';
import { Location } from './entities/location.entity';
import { Schema as MongooSchema } from 'mongoose';

@Resolver('Location')
export class LocationResolver {
	constructor(private readonly locationService: LocationService) {}

	@Query(() => Location, {
		name: 'locationById',
		description: 'Поиск места по id',
	})
	getLocationById(
		@Args('id', { type: () => ID }) id: MongooSchema.Types.ObjectId,
	) {
		return this.locationService.getLocationById(id);
	}

	@Mutation(() => Location, {
		name: 'createLocation',
		description: 'Создать локацию',
	})
	createLocation(
		@Args('createLocationInput') createLocationInput: CreateLocationInput,
	) {
		return this.locationService.createLocation(createLocationInput);
	}

	@Mutation(() => Location, {
		name: 'updateLocation',
		description: 'Обновить локацию',
	})
	updateLocation(
		@Args('updateLocationInput') updateLocationInput: UpdateLocationInput,
	) {
		return this.locationService.updateLocation(
			updateLocationInput._id,
			updateLocationInput,
		);
	}

	@Mutation(() => Location, {
		name: 'removeLocation',
		description: 'Удалить локацию',
	})
	removeLocation(
		@Args('id', { type: () => ID }) id: MongooSchema.Types.ObjectId,
	) {
		return this.locationService.removeLocation(id);
	}
}
