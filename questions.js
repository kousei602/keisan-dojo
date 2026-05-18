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

const Generators = {
    "九九": (level) => {
        let maxMultiplier = 9;
        let minMultiplier = 2;
        if (level === 0) { maxMultiplier = 5; }
        if (level >= 6) { minMultiplier = 11; maxMultiplier = 19; } 
        
        const a = getRandomInt(minMultiplier, maxMultiplier);
        const b = getRandomInt(minMultiplier, maxMultiplier);
        return { q: `${a} × ${b} = ?`, a: (a * b).toString() };
    },
    "整数足し引き": (level) => {
        const maxDigit = level < 3 ? 10 : (level < 6 ? 100 : 1000);
        const a = getRandomInt(1, maxDigit);
        const b = getRandomInt(1, maxDigit);
        const isAdd = Math.random() > 0.5;
        if (isAdd) {
            return { q: `${a} + ${b} = ?`, a: (a + b).toString() };
        } else {
            let big = Math.max(a, b);
            let small = Math.min(a, b);
            if (level >= 5 && Math.random() > 0.5) {
                return { q: `${small} - ${big} = ?`, a: (small - big).toString() };
            }
            return { q: `${big} - ${small} = ?`, a: (big - small).toString() };
        }
    },
    "整数かけ割り": (level) => {
        const isMul = Math.random() > 0.5;
        const maxDigit = level < 3 ? 10 : (level < 6 ? 30 : 100);
        let a = getRandomInt(2, maxDigit);
        let b = getRandomInt(2, maxDigit);
        let c = a * b;
        
        if (isMul) {
            return { q: `${a} × ${b} = ?`, a: c.toString() };
        } else {
            return { q: `${c} ÷ ${a} = ?`, a: b.toString() };
        }
    },
    "小数の計算": (level) => {
        let a = getRandomInt(1, 99) / 10;
        let b = getRandomInt(1, 99) / 10;
        if (level < 4) {
            let isAdd = Math.random() > 0.5;
            if (isAdd) {
                return { q: `${a} + ${b} = ?`, a: ((a * 10 + b * 10) / 10).toString() };
            } else {
                let big = Math.max(a, b);
                let small = Math.min(a, b);
                return { q: `${big} - ${small} = ?`, a: ((big * 10 - small * 10) / 10).toString() };
            }
        } else {
            a = getRandomInt(1, 50) / 10;
            b = getRandomInt(1, 50) / 10;
            let ans = (a * 10) * (b * 10) / 100;
            return { q: `${a} × ${b} = ?`, a: Number(ans.toFixed(2)).toString() };
        }
    },
    "分数の計算": (level) => {
        function gcd(x, y) { return y === 0 ? x : gcd(y, x % y); }
        if (level < 4) {
            let denom = getRandomInt(3, 10);
            let num1 = getRandomInt(1, denom - 1);
            let num2 = getRandomInt(1, denom - 1);
            let isAdd = Math.random() > 0.5;
            if (!isAdd && num1 < num2) { let t=num1; num1=num2; num2=t; }
            let ansNum = isAdd ? num1 + num2 : num1 - num2;
            
            let g = gcd(ansNum, denom);
            ansNum /= g;
            let ansDenom = denom / g;
            
            let ansStr = ansDenom === 1 ? ansNum.toString() : `${ansNum}/${ansDenom}`;
            if (ansNum === 0) ansStr = "0";
            
            let op = isAdd ? '+' : '-';
            return { q: `${num1}/${denom} ${op} ${num2}/${denom} = ?`, a: ansStr };
        } else {
            let b = getRandomInt(2, 6);
            let a = getRandomInt(1, b - 1);
            let d = getRandomInt(2, 6);
            let c = getRandomInt(1, d - 1);
            
            let ansNum = a * c;
            let ansDenom = b * d;
            let g = gcd(ansNum, ansDenom);
            ansNum /= g;
            ansDenom /= g;
            let ansStr = ansDenom === 1 ? ansNum.toString() : `${ansNum}/${ansDenom}`;
            
            return { q: `${a}/${b} × ${c}/${d} = ?`, a: ansStr };
        }
    },
    "四則混合計算": (level) => {
        let a = getRandomInt(2, 20);
        let b = getRandomInt(2, 10);
        let c = getRandomInt(2, 10);
        
        if (level < 3) {
            return { q: `${a} + ${b} × ${c} = ?`, a: (a + b * c).toString() };
        } else if (level < 6) {
            return { q: `(${a} + ${b}) × ${c} = ?`, a: ((a + b) * c).toString() };
        } else {
            let b2 = b * c;
            return { q: `${a} - ${b2} ÷ ${c} = ?`, a: (a - b).toString() };
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
        let val;
        if (level > 3 && Math.random() > 0.5) {
            val = getRandomInt(1, 50) / 10;
        } else {
            val = getRandomInt(1, 50);
        }
        
        const isForward = Math.random() > 0.5;
        if (isForward) {
            let ans = Math.round(val * type.mult);
            return { q: `${val}${type.u1} = ? ${type.u2}`, a: ans.toString() };
        } else {
            let valBig = Math.round(val * type.mult);
            return { q: `${valBig}${type.u2} = ? ${type.u1}`, a: val.toString() };
        }
    },
    "円周率の計算": (level) => {
        const r = getRandomInt(2, level < 4 ? 10 : 30);
        const isArea = level > 2 && Math.random() > 0.5;
        let ans;
        if (isArea) {
            ans = (r * r * 3.14).toFixed(2);
            // remove trailing zeros if any e.g. 12.00 -> 12
            return { q: `半径${r}の円の面積は？`, a: Number(ans).toString() };
        } else {
            ans = (r * 2 * 3.14).toFixed(2);
            return { q: `半径${r}の円周は？`, a: Number(ans).toString() };
        }
    },
    "正負の数": (level) => {
        const maxDigit = level < 4 ? 10 : 50;
        let a = getRandomInt(-maxDigit, maxDigit);
        let b = getRandomInt(-maxDigit, maxDigit);
        if (a === 0) a = 2;
        if (b === 0) b = 3;
        const ops = ['+', '-', '×'];
        const op = ops[getRandomInt(0, level < 2 ? 1 : 2)];
        
        let ans;
        let qStr = `${a} ${op} `;
        if (b < 0) qStr += `(${b})`; else qStr += b;
        
        if (op === '+') ans = a + b;
        if (op === '-') ans = a - b;
        if (op === '×') ans = a * b;
        
        return { q: `${qStr} = ?`, a: ans.toString() };
    },
    "方程式": (level) => {
        let x = getRandomInt(-10, 10);
        if (x === 0) x = getRandomInt(1, 5);
        
        if (level < 3) {
            const b = getRandomInt(-20, 20);
            const c = x + b;
            let bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
            return { q: `x ${bStr} = ${c}`, a: x.toString() };
        } else if (level < 5) {
            const a = getRandomInt(2, 6);
            const b = getRandomInt(-20, 20);
            const c = a * x + b;
            let bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
            return { q: `${a}x ${bStr} = ${c}`, a: x.toString() };
        } else {
            const a = getRandomInt(2, 7);
            let c_coeff = getRandomInt(-3, 3);
            if (a === c_coeff) c_coeff--; 
            const b = getRandomInt(-20, 20);
            const d = (a * x + b) - (c_coeff * x);
            
            let bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
            let dStr = d >= 0 ? `+ ${d}` : `- ${Math.abs(d)}`;
            
            let cStr = '';
            if (c_coeff === 1) cStr = 'x ';
            else if (c_coeff === -1) cStr = '-x ';
            else if (c_coeff !== 0) cStr = `${c_coeff}x `;
            
            if (c_coeff === 0) {
                dStr = d.toString(); 
            } else if (d > 0) {
                dStr = `+ ${d}`;
            }

            return { q: `${a}x ${bStr} = ${cStr}${dStr}`, a: x.toString() };
        }
    }
};

const SubjectCategories = [
    {
        category: "小学校基礎",
        subjects: ["九九", "整数足し引き", "整数かけ割り"]
    },
    {
        category: "小数・分数",
        subjects: ["小数の計算", "分数の計算"]
    },
    {
        category: "算数応用",
        subjects: ["単位変換", "円周率の計算", "四則混合計算"]
    },
    {
        category: "中学校数学",
        subjects: ["正負の数", "方程式"]
    }
];

function generateQuestions(subject, levelIndex, count = 10) {
    const generator = Generators[subject] || Generators["九九"];
    const questions = [];
    for (let i = 0; i < count; i++) {
        questions.push(generator(levelIndex));
    }
    return questions;
}
