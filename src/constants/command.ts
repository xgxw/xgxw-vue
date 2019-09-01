export interface SelectItem {
    name: string;
    desc: string;
    cmd: () => void;
}

export function createSelectItem(name: string, desc: string, path: string, _this: any): SelectItem {
    return {
        name: name,
        desc: desc,
        cmd: goto(path, _this)
    }
}

export function transPathToSelectItem(paths: string[], _this: any): SelectItem[] {
    let result: SelectItem[] = [];
    for (let i = 0; i < paths.length; i++) {
        let path = paths[i];
        let item: SelectItem = {
            name: genGotoCommandName(path),
            desc: "go to " + path,
            cmd: goto(path, _this)
        };
        result.push(item);
    }
    return result;
}

export function goto(path: string, _this: any): () => {} {
    return _this.$nextTick(() => {
        _this.$router.push(path);
    });
}

export function genGotoCommandName(path: string): string {
    return "go " + path
}