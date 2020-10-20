import bootstrap from 'silvie/lib/bootstrap';

import 'middlewares';
import 'controllers';

import * as schemas from 'graphql/schemas';
import * as resolvers from 'graphql/resolvers';
import * as dataLoaders from 'graphql/dataloaders';

bootstrap({ schemas, resolvers, dataLoaders });
