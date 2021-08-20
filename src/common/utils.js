
function hslToRgb (H, S, L) {
    let R, G, B;
    if (+S === 0) {
        R = G = B = L; // 饱和度为0 为灰色
    } else {
        let hue2Rgb = function (p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        let Q = L < 0.5 ? L * (1 + S) : L + S - L * S;
        let P = 2 * L - Q;
        R = hue2Rgb(P, Q, H + 1/3);
        G = hue2Rgb(P, Q, H);
        B = hue2Rgb(P, Q, H - 1/3);
    }
    return [Math.round(R * 255), Math.round(G * 255), Math.round(B * 255)];
}
function randomHsl() {
    let H = Math.random();
    let S = Math.random();
    let L = Math.random();
    return [H, S, L];
}

export function getRgbColorArray (base, length) {
    if (length > base.length) {
        let HSL = [];
        for (let i = 0; i < length - base.length; i++) {
            let ret = randomHsl();
            if (i > 0 && Math.abs(ret[0] - HSL[i - 1][0]) < 0.25) {
                i--;
                continue; // 重新获取随机色
            }
            ret[1] = 0.7 + (ret[1] * 0.2); // [0.7 - 0.9] 排除过灰颜色
            ret[2] = 0.4 + (ret[2] * 0.4); // [0.4 - 0.8] 排除过亮过暗色
            ret.map(item => parseFloat(item.toFixed(2)));
            HSL.push('rgb(' + hslToRgb(ret[0], ret[1], ret[2]) + ')');
        }
        base = base.concat(HSL)
    } else {
        base = base.slice(0, length)
    }
    return base;
}