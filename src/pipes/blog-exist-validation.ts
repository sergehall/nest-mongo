import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { BloggerBlogsRepository } from '../features/blogger-blogs/infrastructure/blogger-blogs.repository';

@ValidatorConstraint({ name: 'BlogExists', async: true })
@Injectable()
export class BlogExistsRule implements ValidatorConstraintInterface {
  constructor(private blogsRepository: BloggerBlogsRepository) {}

  async validate(value: string) {
    try {
      if (await this.blogsRepository.findBlogById(value)) {
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return `Blog id: ${args.value} doesn't exist`;
  }
}
