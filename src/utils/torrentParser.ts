
export const extractInfoBytes = (buffer: ArrayBuffer) => {
    const data = new Uint8Array(buffer);
    let i = 0;
    const char = (code: number) => String.fromCharCode(code);
    const readNumber = () => {
        let n = 0;
        while (i < data.length) {
            const c = char(data[i]);
            if (c < '0' || c > '9') break;
            n = n * 10 + (data[i] - 48);
            i++;
        }
        return n;
    };
    const parseIntVal = () => {
        i++;
        while (i < data.length && data[i] !== 101) i++;
        i++;
    };
    const parseString = () => {
        const len = readNumber();
        i++;
        i += len;
    };
    const parseList = () => {
        i++;
        while (i < data.length && data[i] !== 101) parseAny();
        i++;
    };
    const parseDict = (captureInfo: boolean) => {
        i++;
        while (i < data.length && data[i] !== 101) {
            // const keyStart = i;
            const keyLen = readNumber();
            i++;
            const keyBytes = data.subarray(i, i + keyLen);
            i += keyLen;
            const key = new TextDecoder().decode(keyBytes);
            if (key === 'info' && captureInfo) {
                const start = i;
                parseAny();
                const end = i;
                const slice = data.subarray(start, end);
                return { done: true as const, value: slice };
            } else {
                parseAny();
            }
        }
        i++;
        return { done: false as const };
    };
    const parseAny = () => {
        const c = char(data[i]);
        if (c === 'i') return parseIntVal();
        if (c === 'l') return parseList();
        if (c === 'd') {
            parseDict(false);
            return;
        }
        return parseString();
    };
    const r = parseDict(true);
    if (r.done && r.value) return r.value;
    throw new Error('未找到info字典');
};
