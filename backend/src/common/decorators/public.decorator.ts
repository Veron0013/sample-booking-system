import { SetMetadata } from '@nestjs/common';
import { PUBLIC_KEY } from 'src/utils/constants';

export const Public = () => SetMetadata(PUBLIC_KEY, true);
