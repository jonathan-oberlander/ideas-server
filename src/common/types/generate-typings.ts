import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

// run using ts-node src/common/types/generate-typings.ts

const definitionsFactory = new GraphQLDefinitionsFactory();

definitionsFactory.generate({
  typePaths: ['./src/**/*.graphql'],
  path: join(process.cwd(), 'src/graphql.ts'),
  //   outputAs: 'class',
  watch: true,
  emitTypenameField: true,
});
