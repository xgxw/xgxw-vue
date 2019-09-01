export interface SelectItem {
    name: string;
    desc: string;
    cmd: () => void;
}

export function createSelectItem(name: string, desc: string, cmd: () => void): SelectItem {
    return {
        name: name,
        desc: desc,
        cmd: cmd
    }
}

export function goto(path: string, _this: any): () => void {
    return () => {
        _this.$nextTick(() => {
            _this.$router.push(path);
        });
    }
}

export function transPathToSelectItem(paths: string[], _this: any): SelectItem[] {
    let result: SelectItem[] = [];
    for (let i = 0; i < paths.length; i++) {
        let path = paths[i];
        let item: SelectItem = {
            name: createGotoName(path),
            desc: "go to " + path,
            cmd: goto(path, _this)
        };
        result.push(item);
    }
    return result;
}

export function createGotoName(path: string): string {
    return "go " + path
}

export function createFunName(path: string): string {
    return "fun " + path
}