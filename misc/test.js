// let result = [];
// for (let i = 0; i < 15; i++) {
//     result.push(i);
// }
// r result;


// tokens = ['for ', '(let i = 0; i < 15; i++)', '{', '}', 'console.log(i)', ';']


// if n % 2 == 0 {
//     console.log('even');
// }
// else {
//     console.log('odd');
// }

let a = 'if(1000%2==0){console.lo("even");}else{console.log("odd");}';




// [';','1000','if','(',')','%','2','==','0','{','}','return("even")','return("odd")']

// solution = 'console.log("e")';

// try {
//     eval(a);
//     console.log(eval(solution) == eval(a));
// } catch (e) {
//     console.log('NaN')
// }

const crossover = function(parent1, parent2) {
    let parent1_ls  = parent1.split('*');
    let parent2_ls  = parent2.split('*');
  
    console.log(parent1_ls);
    console.log(parent2_ls);

    let index1 = Math.floor(Math.random() * parent1_ls.length);
    let index2 = Math.floor(Math.random() * parent2_ls.length);
  	console.log(index1);
	console.log(index2);
  
    const parent1Left = parent1_ls.slice(0,index1);
    const parent1Right = parent1_ls.slice(index1);
  	console.log(parent1Left);
	console.log(parent1Right);

    const parent2Left = parent2_ls.slice(0,index2);
    const parent2Right = parent2_ls.slice(index2);
  	console.log(parent2Left);
	console.log(parent2Right);
  
    //C Crossover the left and right side
    let child1 = parent1Left.concat(parent2Right);
    let child2 = parent2Left.concat(parent1Right);
  	console.log(child1.join('*'));
  	console.log(child2.join('*'));
  

    return 0;
}

// 
const tokenList = ['1000','2','0','if','else',';','%','==','(',')','{','}','console.log("even")','console.log("odd")'];
const maxTokensNum = 30


const seed = function() {
    // Limit length of number of tokens used
    const seedLength = () => {
        let len = Math.floor(Math.random() * maxTokensNum) + 1;
        return len
    }

    const getIndividual = () => {
        let result = []
        for (let i=0; i < seedLength(); i++){
            let index = Math.floor(Math.random() * tokenList.length)
            let currentToken = tokenList[index]
            result.push(currentToken)
        };
        return result;
    }
    // Return a random list of tokens for this genome
    console.log(getIndividual().join('*'))
    return 0;
}

// seed();

const mutate = function(entity_str) {
    let entity_ls = entity_str.split('*');
    let index = Math.floor(Math.random() * entity_ls.length);
    let r = Math.floor(Math.random() * tokenList.length);

    const replaceAt = (ls, index, replacement) => {
        let left = ls.slice(0, index).concat(replacement);
        let right = ls.slice(index + 1);
        return left.concat(right);
    };
    console.log(r);
    console.log(tokenList[r])

    let result_ls = replaceAt(entity_ls, index, tokenList[r]);

    
    return result_ls.join('*');
}


// console.log(mutate('if*else*{*(*;'));

// let f = 'if(1000%2==0){console.log("even");}else{console.log("odd");}'
// console.log(f.length)

// if (eval(';') == undefined){
//     console.log(1)
// }

// console.log(eval(';') !== eval('if(1000%2==0){console.log("even");}else{console.log("odd");}'))

const solution = 'if(1000%2==0){console.log("even");}else{console.log("odd");}';

const fitness = function(entity_str) {
    let eval_entity_str = entity_str.replaceAll('*', '');
    let fitness = 0
    console.log('this is code: ' + eval_entity_str);
    // First check if code is evaluable
    try {
        eval(eval_entity_str);
        if (eval(eval_entity_str) == eval(solution)){
            // Higher fitness if test code is shorter than solution length
            fitness = 1000 + (solution.length - eval_entity_str.length);
            console.log(fitness)
        }
        
    } catch (e) {
        fitness = 0;
    }
    return fitness;
}


let prefix = 'function test(){';
let meat = 'if(10002===0){return("even");}else{reurn("");}';
let suffix = '}test();';

let eval_entity_str = undefined;
let sol = prefix + 'if(1000%2===0){return("even");}else{return("odd");}' + suffix;


let fit = () => {

    try {
        eval(eval_entity_str);
        if (eval(eval_entity_str) !== undefined && eval(eval_entity_str) === eval(sol)){
            // Lower fitness score if code string is either longer or shorter than solution length
            return sol.length - Math.abs(sol.length - eval_entity_str.length);
        }
        else {
            return 0;
        }
    } catch (e) {
        return 0;
    }
}

console.log('if(1000%2===0){return("even");}else{return("dd");}' === 'if(1000%2===0){return("even");}else{return("odd");}');
// function test2() {
//     if(1000%2==0){return("even");}else{return("odd");}
// } 

// a = eval(new String(test()))
// console.log(a);

