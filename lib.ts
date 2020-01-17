/**
 * Common interface for digest functions
 */
export default abstract class Digest {
    /**
     * Size in bytes of the output hash
     */
    readonly outputSize: number;

    /**
     * Common constructor for digest functions
     * @param outputSize
     */
    protected constructor(outputSize: number) {
        this.outputSize = outputSize;
    }

    /**
     * Implementation of the input function
     * @param data
     */
    protected abstract _input(data: Uint8Array): void;

    /**
     * Digests the input data
     * @param data - Binary data
     */
    input(data: Uint8Array): void;
    /**
     * Digests the input string
     * @param data - UTF-8 string
     */
    input(data: string): void;
    input(data: Uint8Array | string): void {
        if (typeof data === "string") {
            data = new TextEncoder().encode(data);
        }
        this._input(data);
    }

    /**
     * Implementation of the result function
     * @param output
     */
    protected abstract _result(output: Uint8Array): void;

    /**
     * Calculates the hash of the input
     * @returns Binary hash
     */
    result(): Uint8Array;
    /**
     * Calculates the hash of the input
     * @param encoding
     * @returns Hexadecimal representation of the hash
     */
    result(encoding: "hex"): string;
    /**
     * Calculates the hash of the input
     * @param encoding
     * @returns Binary representation of the hash
     */
    result(encoding: "bin"): string;
    result(encoding?: string): Uint8Array | string {
        let output = new Uint8Array(this.outputSize);
        this._result(output);
        if (!encoding) {
            return output;
        } else if (encoding === "hex") {
            return output.reduce(
                (s, i) => s + ("0" + i.toString(16)).slice(-2),
                ""
            );
        } else if (encoding === "bin") {
            return output.reduce(
                (s, i) => s + ("0000000" + i.toString(2)).slice(-8),
                ""
            );
        } else {
            throw new Error(`Invalid encoding "${encoding}"`);
        }
    }
}
