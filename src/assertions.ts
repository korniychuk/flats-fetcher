import { error } from './dialogs';

export function assertNil<T>(value: T | null | undefined, msg: string = 'Unexpected nil'): asserts value is T {
    if (value == null) {
        error(msg);
        throw new Error(msg);
    }
}
