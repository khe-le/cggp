// Genetic programming
// Learn to build a piece of code that tells if 1000 is even or odd

const tokens = ['1000','2','0','if','else',';','%','===','(',')','{','}','return("even")','return("odd")'];
const solutionStr = 'if(1000%2===0){return("even");}else{return("odd");}';
const maxTokens = 30;
let allFitness = [];

const Genetic = require('genetic-js');
const fs = require("fs")

const genetic = Genetic.create();
genetic.optimize = Genetic.Optimize.Maximize;
genetic.select1 = Genetic.Select1.Fittest;
genetic.select2 = Genetic.Select2.Tournament2;


const utilityManager = {
    editDistance: function(s1, s2) {
        s1 = s1.toLowerCase();
        s2 = s2.toLowerCase();
    
        var costs = new Array();
        for (var i = 0; i <= s1.length; i++) {
            var lastValue = i;
            for (var j = 0; j <= s2.length; j++) {
            if (i == 0)
                costs[j] = j;
            else {
                if (j > 0) {
                var newValue = costs[j - 1];
                if (s1.charAt(i - 1) != s2.charAt(j - 1))
                    newValue = Math.min(Math.min(newValue, lastValue),
                    costs[j]) + 1;
                costs[j - 1] = lastValue;
                lastValue = newValue;
                }
            }
            }
            if (i > 0)
            costs[s2.length] = lastValue;
        }
        return costs[s2.length];
    },

    similarity: function(s1, s2) {
        var longer = s1;
        var shorter = s2;
        if (s1.length < s2.length) {
          longer = s2;
          shorter = s1;
        }
        var longerLength = longer.length;
        if (longerLength == 0) {
          return 1.0;
        }
        return (longerLength - this.editDistance(longer, shorter)) / parseFloat(longerLength);
    },
}


genetic.seed = function() {
    // Limit length of number of tokens used
    const seedLength = () => {
        let len = Math.floor(Math.random() * this.userData.maxTokensNum) + 1;
        return len
    }

    const getIndividual = () => {
        let result = []
        for (let i=0; i < seedLength(); i++){
            let index = Math.floor(Math.random() * this.userData.tokenList.length)
            let currentToken = this.userData.tokenList[index]
            result.push(currentToken)
        };
        return result;
    }
    // Return a random list of tokens for this genome
    return getIndividual().join('*');
}


// Perform crossover on 2 parent genomes to produce 2 child genomes
genetic.crossover = function(parent1, parent2) {
    let parent1_ls  = parent1.split('*');
    let parent2_ls  = parent2.split('*');

    let index1 = Math.floor(Math.random() * parent1_ls.length);
    let index2 = Math.floor(Math.random() * parent2_ls.length);
  
    const parent1Left = parent1_ls.slice(0,index1);
    const parent1Right = parent1_ls.slice(index1);

    const parent2Left = parent2_ls.slice(0,index2);
    const parent2Right = parent2_ls.slice(index2);
  
    // Crossover the left and right side
    let child1 = parent1Left.concat(parent2Right);
    let child2 = parent2Left.concat(parent1Right);
  
    return [child1.join('*'),child2.join('*')]
}

// Perform mutation after crossover
genetic.mutate = function(entity_str) {
    let entity_ls = entity_str.split('*');
    let index = Math.floor(Math.random() * entity_ls.length);
    let r = Math.floor(Math.random() * this.userData.tokenList.length);

    const replaceAt = (ls, index, replacement) => {
        let left = ls.slice(0, index).concat(replacement);
        let right = ls.slice(index + 1);
        return left.concat(right);
    };

    let result_ls = replaceAt(entity_ls, index, this.userData.tokenList[r]);

    return result_ls.join('*');
}

// Fitness calculation
genetic.fitness = function(entity_str) {
    let code_str = entity_str.replaceAll('*', '');
    const prefix = 'function test(){';
    const suffix = '}test();';
    let test_code = prefix + code_str + suffix;
    let solution_code = prefix + this.userData.solution + suffix;

    // First check if code is evaluable
    try {
        eval(test_code);
        if (eval(test_code) !== undefined && eval(test_code) === eval(solution_code)){
            // Lower fitness score if code string is either longer or shorter than solution length
            let length_score = this.userData.solution.length - Math.abs(this.userData.solution.length - code_str.length);
            let match_score = Math.round(this.userData.manager.similarity(code_str,this.userData.solution)*100);
            return length_score + match_score;
        }
        else {
            return 0;
        }
    } catch (e) {
        return 0;
    }

}

// Termination
genetic.generation = function(pop, generation, stats, isDone) {
    let code_str = pop[0].entity.replaceAll('*', '');
    const prefix = 'function test(){';
    const suffix = '}test();';
    let test_code = prefix + code_str + suffix;
    let solution_code = prefix + this.userData.solution + suffix;

    // ---------- Everything below here needs FIXING ---------- 
    try {
        eval(test_code);
        if (eval(test_code) !== undefined && eval(test_code) === eval(solution_code) && code_str === this.userData.solution){
            return false;
        }
        else {
            return true;
        }
    }
    catch(e){
        return true;
    }
}

// Notification method - displaying status while evolving
genetic.notification = function(pop, generation, stats, isDone) {
    let code_str = pop[0].entity.replaceAll('*', '');
    allFitness.push(stats.maximum);
    
    console.log(`Generation ${generation}, Best Fitness ${stats.maximum}, Best individual: ${code_str}`);
  
    if (isDone) {
        console.log(`Individual:`);
        console.log(code_str);
        console.log('Evaluated Result: ' + eval('function test(){' + code_str + '}test();'));
    }
}

// Running the GA by calling evolve method
genetic.evolve({
    iterations: 500000,
    size: 100,
    crossover: 0.5,
    mutation: 0.5,
}, {
    solution: solutionStr,
    tokenList: tokens,
    maxTokensNum: maxTokens,
    manager: utilityManager,
})

// ----- OUTPUT FITNESS + FORMULA TO TXT FILES -----
fs.writeFile('Fitness.txt', allFitness.toString(), (err) => {
    if (err) throw err;
  })
  
fs.writeFile('Solution.txt', solutionStr, (err) => {
    if (err) throw err;
})