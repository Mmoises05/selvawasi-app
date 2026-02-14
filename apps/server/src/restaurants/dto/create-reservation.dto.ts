import { IsNotEmpty, IsInt, Min, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateReservationDto {
    @IsNotEmpty()
    @IsString()
    restaurantId: string;

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    pax: number;

    @IsNotEmpty()
    @IsDateString()
    requestedDate: string;

    @IsOptional()
    @IsString()
    operatorNote?: string;
}
