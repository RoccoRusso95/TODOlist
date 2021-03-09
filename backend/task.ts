import {IsNotEmpty, IsDefined, MaxLength, IsString, IsEnum} from 'class-validator';
import Stato from './stato.enum';

export default class Task {

    @IsNotEmpty()
    @MaxLength(100)
    @IsString()
    titolo: string;

    @IsNotEmpty()
    @MaxLength(500)
    @IsString()
    descrizione: string;

    @IsEnum(Stato)
    stato: Stato;

    @IsDefined()
    dataScadenza: Date;
}