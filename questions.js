// questions.js

const Difficulties = [
    { level: 0, name: "7級" },
    { level: 1, name: "6級" },
    { level: 2, name: "5級" },
    { level: 3, name: "4級" },
    { level: 4, name: "3級" },
    { level: 5, name: "2級" },
    { level: 6, name: "1級" },
    { level: 7, name: "初段" }
];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gcd(x, y) { return y === 0 ? x : gcd(y, x % y); }

const CoreGenerators = {
    // === 小学生向け ===
    "たし算": (level) => {
        if (level < 4) {
            const maxDigit = level < 3 ? 10 : 100;
            const a = getRandomInt(1, maxDigit);
            const b = getRandomInt(1, maxDigit);
            const ans = a + b;
            return { q: `${a} + ${b} = ?`, a: ans.toString(), hint: `${a}と${b}を足します。一の位から順に計算しましょう。` };
        } else {
            const termsCount = getRandomInt(3, 4);
            let terms = [];
            let ans = 0;
            for(let i=0; i<termsCount; i++) {
                let v = getRandomInt(10, 100);
                terms.push(v);
                ans += v;
            }
            return { q: `${terms.join(' + ')} = ?`, a: ans.toString(), hint: `複数のたし算です。順番に足すか、足しやすいペアを見つけて計算しましょう。` };
        }
    },
    "ひき算": (level) => {
        if (level < 4) {
            const maxDigit = level < 3 ? 10 : 100;
            let a = getRandomInt(1, maxDigit);
            let b = getRandomInt(1, maxDigit);
            let big = Math.max(a, b);
            let small = Math.min(a, b);
            return { q: `${big} - ${small} = ?`, a: (big - small).toString(), hint: `${big}から${small}を引きます。桁を揃えて計算しましょう。` };
        } else {
            const termsCount = getRandomInt(3, 4);
            let total = getRandomInt(100, 500);
            let ans = total;
            let terms = [total];
            for(let i=1; i<termsCount; i++) {
                let v = getRandomInt(10, 50);
                terms.push(v);
                ans -= v;
            }
            return { q: `${terms.join(' - ')} = ?`, a: ans.toString(), hint: `順番に引くか、引く数をすべて足してから一気に引きましょう。` };
        }
    },
    "九九": (level) => {
        let maxMultiplier = 9;
        let minMultiplier = 2;
        if (level === 0) maxMultiplier = 5;
        if (level >= 6) { minMultiplier = 11; maxMultiplier = 19; } 
        const a = getRandomInt(minMultiplier, maxMultiplier);
        const b = getRandomInt(minMultiplier, maxMultiplier);
        return { q: `${a} × ${b} = ?`, a: (a * b).toString(), hint: `${a}を${b}回足した数です。` };
    },
    "かけ算": (level) => {
        if (level < 4) {
            const maxA = level < 3 ? 20 : 100;
            const maxB = level < 3 ? 9 : 50;
            const a = getRandomInt(2, maxA);
            const b = getRandomInt(2, maxB);
            return { q: `${a} × ${b} = ?`, a: (a * b).toString(), hint: `筆算を使って計算しましょう。` };
        } else {
            let termsCount = getRandomInt(3, 4);
            let terms = [];
            let ans = 1;
            for(let i=0; i<termsCount; i++) {
                let v = getRandomInt(2, 10);
                if (i === 0 && Math.random() > 0.5) v = getRandomInt(10, 20); // Make the first one slightly bigger
                terms.push(v);
                ans *= v;
            }
            return { q: `${terms.join(' × ')} = ?`, a: ans.toString(), hint: `順番にかけるか、かけやすいペア（例: 2×5=10）を先に見つけて計算しましょう。` };
        }
    },
    "わり算": (level) => {
        if (level < 4) {
            const maxA = level < 3 ? 9 : 30;
            const maxB = level < 3 ? 9 : 20;
            const a = getRandomInt(2, maxA);
            const b = getRandomInt(2, maxB);
            const c = a * b;
            return { q: `${c} ÷ ${a} = ?`, a: b.toString(), hint: `${a}に何をかけると${c}になるか考えます。` };
        } else {
            // A ÷ B ÷ C
            let c = getRandomInt(2, 10);
            let b = getRandomInt(2, 10);
            let a = getRandomInt(2, 10); // final answer
            let startVal = a * b * c;
            return { q: `${startVal} ÷ ${b} ÷ ${c} = ?`, a: a.toString(), hint: `左から順番に割り算するか、わる数を先にかけて（${b}×${c}=${b*c}）一気に割りましょう。` };
        }
    },
    "小数のたし算・ひき算": (level) => {
        let a = getRandomInt(1, 99) / 10;
        let b = getRandomInt(1, 99) / 10;
        const isAdd = Math.random() > 0.5;
        if (isAdd) {
            let ans = ((a * 10 + b * 10) / 10).toString();
            return { q: `${a} + ${b} = ?`, a: ans, hint: `小数点の位置を揃えて足し算します。` };
        } else {
            let big = Math.max(a, b);
            let small = Math.min(a, b);
            let ans = ((big * 10 - small * 10) / 10).toString();
            return { q: `${big} - ${small} = ?`, a: ans, hint: `小数点の位置を揃えて引き算します。` };
        }
    },
    "小数のかけ算・わり算": (level) => {
        const isMul = Math.random() > 0.5;
        if (isMul) {
            let a = getRandomInt(1, 50) / 10;
            let b = getRandomInt(1, 50) / 10;
            let ans = Number(((a * 10) * (b * 10) / 100).toFixed(2)).toString();
            return { q: `${a} × ${b} = ?`, a: ans, hint: `整数として計算したあと、小数点を2つ移動します。` };
        } else {
            let a = getRandomInt(1, 20) / 10;
            let b = getRandomInt(2, 9);
            let c = ((a * 10) * b) / 10;
            return { q: `${c} ÷ ${b} = ?`, a: a.toString(), hint: `${c * 10} ÷ ${b} を計算して、小数点を1つ移動します。` };
        }
    },
    "分数のたし算・ひき算": (level) => {
        let denom1 = getRandomInt(2, 6);
        let denom2 = level < 4 ? denom1 : getRandomInt(2, 6);
        let num1 = getRandomInt(1, denom1 * 2);
        let num2 = getRandomInt(1, denom2 * 2);
        const isAdd = Math.random() > 0.5;
        
        let cd = denom1 * denom2;
        let n1 = num1 * denom2;
        let n2 = num2 * denom1;
        
        if (!isAdd && n1 < n2) { let t=n1; n1=n2; n2=t; let t2=num1; num1=num2; num2=t2; let t3=denom1; denom1=denom2; denom2=t3;}
        
        let ansNum = isAdd ? n1 + n2 : n1 - n2;
        let g = gcd(ansNum, cd);
        ansNum /= g;
        let ansDenom = cd / g;
        
        let ansStr = ansDenom === 1 ? ansNum.toString() : `${ansNum}/${ansDenom}`;
        if (ansNum === 0) ansStr = "0";
        let op = isAdd ? '+' : '-';
        return { 
            q: `${num1}/${denom1} ${op} ${num2}/${denom2} = ?`, 
            a: ansStr, 
            hint: level < 4 ? `分母はそのまま、分子だけを計算します。` : `分母を揃える（通分）をしてから計算し、最後に約分します。` 
        };
    },
    "分数のかけ算・わり算": (level) => {
        let denom1 = getRandomInt(2, 6);
        let denom2 = getRandomInt(2, 6);
        let num1 = getRandomInt(1, denom1 * 2);
        let num2 = getRandomInt(1, denom2 * 2);
        const isMul = Math.random() > 0.5;
        
        let ansNum, ansDenom;
        if (isMul) {
            ansNum = num1 * num2;
            ansDenom = denom1 * denom2;
        } else {
            ansNum = num1 * denom2;
            ansDenom = denom1 * num2;
        }
        
        let g = gcd(ansNum, ansDenom);
        ansNum /= g;
        ansDenom /= g;
        
        let ansStr = ansDenom === 1 ? ansNum.toString() : `${ansNum}/${ansDenom}`;
        if (ansNum === 0) ansStr = "0";
        let op = isMul ? '×' : '÷';
        return { 
            q: `${num1}/${denom1} ${op} ${num2}/${denom2} = ?`, 
            a: ansStr, 
            hint: isMul ? `分子どうし、分母どうしをかけ算して約分します。` : `割り算は、逆数にしてかけ算に直します。` 
        };
    },
    "四則混合計算": (level) => {
        if (level < 4) {
            let a = getRandomInt(2, 20);
            let b = getRandomInt(2, 10);
            let c = getRandomInt(2, 10);
            return { q: `${a} + ${b} × ${c} = ?`, a: (a + b * c).toString(), hint: `かけ算・わり算を先に計算します。\n${b} × ${c} = ${b * c}\n${a} + ${b * c} = ${a + b * c}` };
        } else {
            let a = getRandomInt(2, 9);
            let b = getRandomInt(10, 30);
            let c = getRandomInt(-10, -1);
            let e = getRandomInt(2, 9);
            let ansDiv = getRandomInt(2, 15);
            let d = e * ansDiv;
            
            let qStr = `${a} × (${b} ${c}) - ${d} ÷ ${e} = ?`;
            let ans = a * (b + c) - (d / e);
            let hintStr = `カッコの中と、かけ算・わり算を先に計算します。\nカッコ: ${b} ${c} = ${b+c}\nかけ算: ${a} × ${b+c} = ${a*(b+c)}\nわり算: ${d} ÷ ${e} = ${d/e}\n最後に引き算: ${a*(b+c)} - ${d/e} = ${ans}`;
            
            return { q: qStr, a: ans.toString(), hint: hintStr };
        }
    },
    "単位変換": (level) => {
        const types = [
            { u1: 'km', u2: 'm', mult: 1000 },
            { u1: 'kg', u2: 'g', mult: 1000 },
            { u1: 'L', u2: 'mL', mult: 1000 },
            { u1: 'm', u2: 'cm', mult: 100 }
        ];
        const type = types[getRandomInt(0, types.length - 1)];
        let val = level > 3 && Math.random() > 0.5 ? getRandomInt(1, 50) / 10 : getRandomInt(1, 50);
        
        if (Math.random() > 0.5) {
            let ans = Math.round(val * type.mult);
            return { q: `${val}${type.u1} = ? ${type.u2}`, a: ans.toString(), hint: `1${type.u1} は ${type.mult}${type.u2} です。` };
        } else {
            let valBig = Math.round(val * type.mult);
            return { q: `${valBig}${type.u2} = ? ${type.u1}`, a: val.toString(), hint: `${type.mult}${type.u2} で 1${type.u1} になります。` };
        }
    },
    "円周率の計算": (level) => {
        const r = getRandomInt(2, level < 4 ? 10 : 20);
        const isArea = Math.random() > 0.5;
        if (isArea) {
            let ans = (r * r * 3.14).toFixed(2);
            return { q: `半径${r}の円の面積は？`, a: Number(ans).toString(), hint: `円の面積 = 半径 × 半径 × 3.14` };
        } else {
            let ans = (r * 2 * 3.14).toFixed(2);
            return { q: `半径${r}の円周は？`, a: Number(ans).toString(), hint: `円周 = 直径(半径×2) × 3.14` };
        }
    },
    
    // === 中学生向け ===
    "正負の数": (level) => {
        if (level < 4) {
            let a = getRandomInt(-20, 20);
            let b = getRandomInt(-20, 20);
            if (a === 0) a = 2; if (b === 0) b = 3;
            const ops = ['+', '-', '×'];
            const op = ops[getRandomInt(0, 2)];
            
            let qStr = `${a} ${op} ${b < 0 ? `(${b})` : b}`;
            let ans;
            if (op === '+') ans = a + b;
            if (op === '-') ans = a - b;
            if (op === '×') ans = a * b;
            
            let hintStr = "";
            if (op === '+') hintStr = `同符号は足して共通の符号、異符号は差をとって大きい方の符号。`;
            if (op === '-') hintStr = `引き算は、足し算に直して符号を逆にします。`;
            if (op === '×') hintStr = `マイナス×マイナスはプラスになります。`;
            
            return { q: `${qStr} = ?`, a: ans.toString(), hint: hintStr };
        } else {
            let termsCount = getRandomInt(3, 4);
            let qStr = "";
            let ans = 0;
            for(let i=0; i<termsCount; i++) {
                let v = getRandomInt(-15, 15);
                if (v === 0) v = 2;
                let isAdd = Math.random() > 0.5;
                if (i === 0) {
                    qStr += `${v}`;
                    ans = v;
                } else {
                    let op = isAdd ? '+' : '-';
                    qStr += ` ${op} ${v < 0 ? `(${v})` : v}`;
                    ans = isAdd ? ans + v : ans - v;
                }
            }
            return { q: `${qStr} = ?`, a: ans.toString(), hint: `項を整理し、正の数と負の数それぞれでまとめてから計算しましょう。` };
        }
    },
    "比例・反比例": (level) => {
        const isProportional = Math.random() > 0.5;
        let x1 = getRandomInt(2, 6);
        let a = getRandomInt(2, 6);
        let y1, y2, x2;
        
        if (isProportional) {
            y1 = a * x1;
            x2 = getRandomInt(2, 10);
            while (x1 === x2) x2 = getRandomInt(2, 10);
            y2 = a * x2;
            return { 
                q: `yはxに比例し、x=${x1}のときy=${y1}。\nx=${x2}のときy=?`, 
                a: y2.toString(), 
                hint: `y = ax に代入します。\n${y1} = a × ${x1} より、比例定数a=${a}\nよって y = ${a} × ${x2} = ${y2}` 
            };
        } else {
            let a_inverse = getRandomInt(12, 36);
            x1 = 2; y1 = a_inverse / x1;
            while (a_inverse % x1 !== 0) { x1++; y1 = a_inverse / x1; }
            x2 = x1 + 1;
            while (a_inverse % x2 !== 0 && x2 < 20) x2++;
            if (a_inverse % x2 !== 0) { x2 = 1; }
            y2 = a_inverse / x2;
            
            return { 
                q: `yはxに反比例し、x=${x1}のときy=${y1}。\nx=${x2}のときy=?`, 
                a: y2.toString(), 
                hint: `y = a/x に代入します。\n${y1} = a / ${x1} より、比例定数a=${x1*y1}\nよって y = ${x1*y1} / ${x2} = ${y2}` 
            };
        }
    },
    "一次方程式": (level) => {
        let x = getRandomInt(-10, 10) || 2;
        if (level < 4) {
            let a = getRandomInt(2, 5);
            let c_coeff = getRandomInt(-2, 2);
            if (a === c_coeff) c_coeff--; 
            let b = getRandomInt(-15, 15);
            let d = (a * x + b) - (c_coeff * x);
            
            let bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
            let dStr = d >= 0 ? `+ ${d}` : `- ${Math.abs(d)}`;
            let cStr = c_coeff === 1 ? 'x ' : (c_coeff === -1 ? '-x ' : (c_coeff !== 0 ? `${c_coeff}x ` : ''));
            if (c_coeff === 0) { dStr = d.toString(); } else if (d > 0) { dStr = `+ ${d}`; }

            let hintStr = `xの項を左辺に、数字を右辺に移行します。\n${a - c_coeff}x = ${d - b}\nx = ${x}`;
            return { q: `${a}x ${bStr} = ${cStr}${dStr}`, a: x.toString(), hint: hintStr };
        } else {
            let A = getRandomInt(2, 5);
            let C = getRandomInt(2, 5);
            if (A === C) C--;
            let B = getRandomInt(-9, 9);
            let D = getRandomInt(-9, 9);
            
            let E = (A - C) * x + (A * B) + (C * D);
            
            let bStr = B > 0 ? `+ ${B}` : `- ${Math.abs(B)}`;
            let dStr = D > 0 ? `- ${D}` : `+ ${Math.abs(D)}`;
            let eStr = E > 0 ? `+ ${E}` : (E < 0 ? `- ${Math.abs(E)}` : "");
            
            let hintStr = `カッコを展開します。\n${A}x ${A*B > 0 ? '+ '+A*B : '- '+Math.abs(A*B)} = ${C}x ${C*(-D) > 0 ? '+ '+C*(-D) : '- '+Math.abs(C*D)} ${eStr}\n移項して整理します。\n${A - C}x = ${(C*(-D) + E) - (A*B)}\nx = ${x}`;
            return { q: `${A}(x ${bStr}) = ${C}(x ${dStr}) ${eStr}`, a: x.toString(), hint: hintStr };
        }
    },
    "平方根": (level) => {
        const type = getRandomInt(1, 2);
        if (type === 1) {
            let ans = getRandomInt(2, 10);
            let a = getRandomInt(2, 5);
            let b = (ans * ans) / a;
            if (!Number.isInteger(b)) { a = ans; b = ans; } 
            return { q: `√${a} × √${b} = ?`, a: ans.toString(), hint: `√( ${a} × ${b} ) = √${a*b} = ${ans}` };
        } else {
            let a = getRandomInt(1, 9);
            let rootVal = a * a;
            return { q: `√${rootVal} = ?`, a: a.toString(), hint: `${a}を2乗すると${rootVal}になるため、√${rootVal}は${a}です。` };
        }
    },
    "二次方程式": (level) => {
        let ans1 = getRandomInt(-5, 5);
        let ans2 = getRandomInt(-5, 5);
        if (ans1 === 0) ans1 = 1;
        if (ans2 === 0) ans2 = 2;
        if (ans1 === ans2) ans2++; 
        
        let sum = ans1 + ans2;
        let prod = ans1 * ans2;
        
        let ansStr1 = `${ans1},${ans2}`;
        let ansStr2 = `${ans2},${ans1}`;
        
        if (level < 4) {
            let bStr = sum === 0 ? "" : (sum > 0 ? `- ${sum}x` : `+ ${Math.abs(sum)}x`);
            if (sum === 1) bStr = "- x";
            if (sum === -1) bStr = "+ x";
            let cStr = prod === 0 ? "" : (prod > 0 ? `+ ${prod}` : `- ${Math.abs(prod)}`);
            let hintStr = `かけて ${prod} 、足して ${sum === 0 ? 0 : -sum} になる2つの数を探します。\n(x - ${ans1})(x - ${ans2}) = 0\nよって x = ${ans1}, ${ans2}`;
            return { q: `x² ${bStr} ${cStr} = 0`, a: [ansStr1, ansStr2], hint: hintStr };
        } else {
            let sumStr = sum === 0 ? "" : (sum > 0 ? `- ${sum}` : `+ ${Math.abs(sum)}`);
            let rhs = -prod;
            let qStr = sum === 0 ? `x² = ${rhs}` : `x(x ${sumStr}) = ${rhs}`;
            let hintStr = `展開して右辺を0にします。\nx² ${sum > 0 ? '- '+sum : '+ '+Math.abs(sum)}x ${rhs > 0 ? '- '+rhs : '+ '+Math.abs(rhs)} = 0\n(x - ${ans1})(x - ${ans2}) = 0\nx = ${ans1}, ${ans2}`;
            return { q: qStr, a: [ansStr1, ansStr2], hint: hintStr };
        }
    }
};

const SubjectCategories = [
    {
        category: "小学生向け",
        subjects: [
            "たし算", "ひき算", "九九", "かけ算", "わり算", "整数まとめ",
            "小数のたし算・ひき算", "小数のかけ算・わり算", "小数まとめ",
            "分数のたし算・ひき算", "分数のかけ算・わり算", "分数まとめ",
            "単位変換", "円周率の計算", "四則混合計算", "全部ごちゃまぜ"
        ]
    },
    {
        category: "中学生向け",
        subjects: [
            "正負の数", "比例・反比例", "一次方程式", "平方根", "二次方程式"
        ]
    }
];

function getSummaryGenerator(subjectList) {
    return (level) => {
        let sub = subjectList[getRandomInt(0, subjectList.length - 1)];
        return CoreGenerators[sub](level);
    };
}

const Generators = { ...CoreGenerators };

Generators["整数まとめ"] = getSummaryGenerator(["たし算", "ひき算", "九九", "かけ算", "わり算"]);
Generators["小数まとめ"] = getSummaryGenerator(["小数のたし算・ひき算", "小数のかけ算・わり算"]);
Generators["分数まとめ"] = getSummaryGenerator(["分数のたし算・ひき算", "分数のかけ算・わり算"]);
Generators["全部ごちゃまぜ"] = getSummaryGenerator([
    "たし算", "ひき算", "九九", "かけ算", "わり算", 
    "小数のたし算・ひき算", "小数のかけ算・わり算", 
    "分数のたし算・ひき算", "分数のかけ算・わり算", 
    "単位変換", "円周率の計算"
]);

function generateQuestions(subject, levelIndex, count = 10) {
    const generator = Generators[subject] || Generators["たし算"];
    const questions = [];
    for (let i = 0; i < count; i++) {
        questions.push(generator(levelIndex));
    }
    return questions;
}
