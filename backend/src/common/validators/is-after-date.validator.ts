import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isAfterDate', async: false })
export class IsAfterDateConstraint implements ValidatorConstraintInterface {
  validate(propertyValue: string, args: ValidationArguments) {
    const relatedPropertyName = String(args.constraints[0]);
    const obj = args.object as Record<string, unknown>;
    const relatedValue = obj[relatedPropertyName];
    if (!propertyValue || !relatedValue) return false;

    const targetDate = new Date(propertyValue);
    const relatedDate = new Date(relatedValue as string);

    return targetDate > relatedDate;
  }

  defaultMessage(args: ValidationArguments) {
    const relatedPropertyName = String(args.constraints[0]);
    return `${args.property} must be after ${relatedPropertyName}`;
  }
}

export function IsAfterDate(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsAfterDateConstraint,
    });
  };
}
