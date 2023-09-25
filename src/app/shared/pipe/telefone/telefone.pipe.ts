import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'telefone'
})
export class TelefonePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;
    
    const phoneNumber = value.replace(/\D/g, '');

    const formattedPhoneNumber = `(${phoneNumber.substring(0, 2)}) ${phoneNumber.substring(2, 7)}-${phoneNumber.substring(7)}`;

    return formattedPhoneNumber;
  }

}
