import tty from 'node:tty';
import { type Stream } from 'stream';
type Options = {
    defaultWidth?: number;
    output?: Stream | typeof process.stdout;
    tty?: typeof tty;
};
export default function cliWidth(options?: Options): number | undefined;
export {};
//# sourceMappingURL=index.d.ts.map