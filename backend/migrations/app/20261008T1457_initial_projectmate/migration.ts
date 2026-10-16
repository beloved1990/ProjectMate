#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/c2df37e75ed1261669cac71b4e161bd67fa3130ff123632ef04fa7076ef09698/contract';
import endContract from '../../snapshots/c2df37e75ed1261669cac71b4e161bd67fa3130ff123632ef04fa7076ef09698/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [];
  }
}

MigrationCLI.run(import.meta.url, M);
