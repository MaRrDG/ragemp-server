export class GlobalService {
	getEntities() {}

	getEntityByUsername({ username }: { username: string }) {}

	postEntity({ entity }: { entity: any }) {}

	putEntity({ username, entity }: { username: string; entity: any }) {}

	patchEntity({ username, entity }: { username: string; entity: any }) {}
}
