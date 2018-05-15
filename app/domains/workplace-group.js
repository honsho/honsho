import { Workplace } from './workplace';

export class WorkplaceGroup {
    constructor({ id, title, workplacesIds }) {
        this.id = id;
        this.title = title || '';
        this.workplacesIds = workplacesIds || [];
    }
}