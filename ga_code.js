// Genetic programming
// Learn to build a piece of code that tells if 1000 is even or odd

const tokens = ['1000','2','0','if','else',';','%','==','(',')','{','}','console.log("even")','console.log("odd")'];
const solutionStr = 'if(1000%2==0){console.log("even");}else{console.log("odd");}';
const maxTokens = 30;

const Genetic = require('genetic-js');

const genetic = Genetic.create();
genetic.optimize = Genetic.Optimize.Maximize;
genetic.select1 = Genetic.Select1.Fittest;
genetic.select2 = Genetic.Select2.Tournament2;


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
    let eval_entity_str = entity_str.replaceAll('*', '');
    let fitness = 0

    // ---------- Everything below here needs FIXING ---------- 
    // First check if code is evaluable
    try {
        eval(eval_entity_str);
        fitness = 1000
        if (eval(eval_entity_str) !== undefined){
            // Higher fitness if test code is shorter than solution length
            fitness += (this.userData.solution.length - eval_entity_str.length);
        }
        
    } catch (e) {
        fitness = 0;
    }
    return fitness;
    // -------- Everything above this line needs FIXING -------- 

}

// Termination
genetic.generation = function(pop, generation, stats, isDone) {
    let entity_str = pop[0].entity.replaceAll('*', '');

    // ---------- Everything below here needs FIXING ---------- 
    if (eval(entity_str) == undefined){
        return true;
    }
    else if (eval(entity_str) == eval(this.userData.solution)){
        return false;
    }
    else {
        return true;
    };
    // -------- Everything above this line needs FIXING -------- 
}

// Notification method - displaying status while evolving
genetic.notification = function(pop, generation, stats, isDone) {
    let entity_str = pop[0].entity.replaceAll('*', '');
    
    console.log(`Generation ${generation}, Best Fitness ${stats.maximum}, Best individual: ${entity_str}`);
  
    if (isDone) {
        console.log(`Result:`);
        console.log(eval(entity_str));
    }
}

// Running the GA by calling evolve method
genetic.evolve({
    iterations: 100000,
    size: 100,
    crossover: 0.3,
    mutation: 0.3,
}, {
    solution: solutionStr,
    tokenList: tokens,
    maxTokensNum: maxTokens,
})
