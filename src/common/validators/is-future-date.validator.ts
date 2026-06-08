import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isFutureDate', async: false })
export class IsFutureDateConstraint implements ValidatorConstraintInterface {
  validate(propertyValue: string) {
    if (!propertyValue) return false;
    const date = new Date(propertyValue);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to midnight

    // Convert propertyValue to local time midnight for fair comparison
    const targetDate = new Date(date.toISOString().split('T')[0] + 'T00:00:00');

    return targetDate >= today;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be today or a future date`;
  }
}

export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsFutureDateConstraint,
    });
  };
}
