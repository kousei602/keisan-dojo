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
        if (level >= 6) { minMultiplier = 11; maxMultiplier = 19; } // Indian math style for advanced
        
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
                // allow negative answers at high levels
                return { q: `${small} - ${big} = ?`, a: (small - big).toString() };
            }
            return { q: `${big} - ${small} = ?`, a: (big - small).toString() };
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
                dStr = d.toString(); // no sign needed if it's the only term
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
        subjects: ["九九", "整数足し引き"]
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
