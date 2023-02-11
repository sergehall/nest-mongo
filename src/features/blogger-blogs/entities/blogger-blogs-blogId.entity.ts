import { IsNotEmpty, Length } from 'class-validator';

export class BloggerBlogsBlogIdEntity {
  @IsNotEmpty()
  @Length(0, 100, {
    message: 'Incorrect id length! Must be min 1, max 100 ch.',
  })
  id: string;
}
