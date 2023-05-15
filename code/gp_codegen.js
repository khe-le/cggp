// Genetic Programming
// Learn to build a piece of code that tells if x is even or odd
const Genetic = require('genetic-js');
const fs = require("fs")
const esprima = require('esprima');

let fitnessData = [];

let testCases = [];

for (let x = -10; x <= 20; x++) {
    testCases.push(x);
}

const genetic = Genetic.create();
genetic.optimize = Genetic.Optimize.Maximize;
genetic.select1 = Genetic.Select1.Fittest;
genetic.select2 = Genetic.Select2.Tournament2;

const utilityManager = {
    solution: 'function main(){if(x%2===0){return"even";}else{return"odd";}}main();',
    operators: '%-+*/',
    identifier: 'x',
    literals: '123456789',

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

    getASTRoot: function() {
        return {
            "type": "Program",
            "body": [
                {
                "type": "FunctionDeclaration",
                "id": {
                    "type": "Identifier",
                    "name": "main"
                },
                "params": [],
                "body": {
                    "type": "BlockStatement",
                    "body": [
                    {
                        "type": "IfStatement",
                        "test": {
                            "type": "BinaryExpression",
                            "operator": "===",
                            "left": {},
                            "right": {}
                        },
                        "consequent": {
                            "type": "BlockStatement",
                            "body": [{
                                "type": "ReturnStatement",
                                "argument": {
                                    "type": "Literal",
                                    "value": "even",
                                    "raw": "\"even\""
                                }}
                            ]
                        },
                        "alternate": {
                        "type": "BlockStatement",
                        "body": [
                            {
                            "type": "ReturnStatement",
                            "argument": {
                                "type": "Literal",
                                "value": "odd",
                                "raw": "\"odd\""
                            }
                            }
                        ]
                        }
                    }
                    ]
                },
                "generator": false,
                "expression": false,
                "async": false
                },
                {
                "type": "ExpressionStatement",
                "expression": {
                    "type": "CallExpression",
                    "callee": {
                    "type": "Identifier",
                    "name": "main"
                    },
                    "arguments": []
                }
                }
            ],
            "sourceType": "script"
        }
    },

    getIdentifierNode: function() {
        const node = {
            "type": "Identifier",
            "name": this.identifier
        }
        return node;
    },

    getLiteralNode: function() {
        const lts = '123456789';
        const val = lts[Math.floor(Math.random() * lts.length)]
        const node = {
            "type": "Literal",
            "value": Number(val),
            "raw": val
        }
        return node;
    },

    getBinaryExp: function() {
        const ops = '%-+*/';
        const operator = ops[Math.floor(Math.random() * ops.length)];
        const node = {
            "type": "BinaryExpression",
            "operator": operator,
            "left": {},
            "right": {}
        }
        return node;
    },

    getTotalNodes: function(root) {
        if (root === null) {
            return 0;
        }
      
        let l = root.left ? this.getTotalNodes(root.left) : this.getTotalNodes(null);
        let r = root.right ? this.getTotalNodes(root.right) : this.getTotalNodes(null);
      
        return 1 + l + r;
    },

    mutateNthNode: function(root, N) {
        let flag = 0;
        // function to find the N-th node in the preorder
        // traversal of a given binary tree
        function setNthNodePreorder(root, N) {
            if (root == null)
                return;
        
            if (flag <= N){
            flag++;
        
            // mutate the n-th node, do nothing if it's identifer node
            if (flag == N)
                if (root.type === "Literal"){ // ---> Literal node
                    // Replace with a literal
                    const lts = '123456789';
                    let val = lts[Math.floor(Math.random() * lts.length)]
                    root.value = Number(val);
                    root.raw = val;
                }
                else if(root.type === "BinaryExpression"){ // ---> Operator node
                    // Replace with an operator
                    const ops = '%-+*/';
                    let operator = ops[Math.floor(Math.random() * ops.length)];
                    root.operator = operator;
                }
            // left recursion
            root.left ? setNthNodePreorder(root.left, N) : setNthNodePreorder(null, N);
            // right recursion
            root.right ? setNthNodePreorder(root.right, N) : setNthNodePreorder(null, N);
            }
        }

        setNthNodePreorder(root,N)
    },

    evaluateCode: function(codeStr, testCase){
        codeStr = codeStr.replaceAll(this.identifier,testCase);
        return eval(codeStr);
    }

}

genetic.seed = function() {
    const getSubtree = (maxD, d) => { // recursively generate subtrees
        let subtree = {};
        if (d > maxD) { // base case => generate either x or literal node
            let rand = Math.floor(Math.random() * 2); // this gives either 0 or 1
            subtree = rand ? this.userData.manager.getIdentifierNode() : this.userData.manager.getLiteralNode();
        }
        else {
            let rand = Math.floor(Math.random() * 2);
            if (rand) {
                let rand2 = Math.floor(Math.random() * 2);
                subtree = rand2 ? this.userData.manager.getIdentifierNode() : this.userData.manager.getLiteralNode();
            }
            else {
                subtree = this.userData.manager.getBinaryExp();
                // Recursively add right and left children if node is a binary expression
                subtree.left = getSubtree(maxD, d + 1);
                subtree.right = getSubtree(maxD, d + 1);
            }
        }
        return subtree; // an object {...}, part of AST
    }

    const tree = (maxDepth) => {
        let result = JSON.parse(JSON.stringify(this.userData.manager.getASTRoot()));
        const leftSubtree = getSubtree(maxDepth,0);
        const rightSubtree = getSubtree(maxDepth,0);

        result.body[0].body.body[0].test.left = leftSubtree;
        result.body[0].body.body[0].test.right = rightSubtree;

        return result;
    }

    return tree(this.userData.maxTreeDepth); // a complete AST
}

genetic.crossover = function(parent1, parent2) {
    let p1_leftSubtree = parent1.body[0].body.body[0].test.left;
    let p2_leftSubtree = parent2.body[0].body.body[0].test.left;
    let p1_rightSubtree = parent1.body[0].body.body[0].test.right;
    let p2_rightSubtree = parent2.body[0].body.body[0].test.right;
  
    let child1 = JSON.parse(JSON.stringify(this.userData.manager.getASTRoot()));
    let child2 = JSON.parse(JSON.stringify(this.userData.manager.getASTRoot()));

    let flag = Math.floor(Math.random() * 2);
  
    if (flag === 0){
        child1.body[0].body.body[0].test.left = p2_leftSubtree;
        child1.body[0].body.body[0].test.right = p1_rightSubtree;
        
        child2.body[0].body.body[0].test.left = p1_leftSubtree;
        child2.body[0].body.body[0].test.right = p2_rightSubtree;
    }
    else{
        child1.body[0].body.body[0].test.left = p2_rightSubtree;
        child1.body[0].body.body[0].test.right = p1_rightSubtree;
        
        child2.body[0].body.body[0].test.left = p2_leftSubtree;
        child2.body[0].body.body[0].test.right = p1_leftSubtree;
    }

    return [child1,child2];
}

genetic.mutate = function(ast) {
    const totalNodes = this.userData.manager.getTotalNodes(ast.body[0].body.body[0].test);

    // Randomly pick a node to mutate
    let n = 1 + Math.floor(Math.random() * totalNodes); // always skip root node
    while(n === 1){
        n = 1 + Math.floor(Math.random() * totalNodes);
    }

    this.userData.manager.mutateNthNode(ast.body[0].body.body[0].test,n);

    // Return randomly mutated AST
    return ast;
}

genetic.fitness = function(ast) {
    const escodegen = require('escodegen');

    const solutionCode = this.userData.manager.solution;
    const myCode = escodegen.generate(ast);

    const test_score = this.userData.testCases.map(testCase => {
        const target = this.userData.manager.evaluateCode(myCode, testCase);
        const actual = this.userData.manager.evaluateCode(solutionCode, testCase);

        // Give 100 points for each passed test case, 0 if not passed
        return target == actual ? 100 : 0;
    }).reduce((total, x) => { return total + x; });

    const actualCode = this.userData.manager.solution.replaceAll((/  |\r\n|\n|\r|\s/gm),'');
    const targetCode = myCode.replace((/  |\r\n|\n|\r|\s/gm),'');
    
    // Lower fitness by the number of characters the target code differ from actual code, either longer or shorter
    const length_score = actualCode.length - Math.abs(actualCode.length - targetCode.length);
    // Add percentage of matching level: +100 if identical
    const match_score = Math.round(this.userData.manager.similarity(targetCode,actualCode)*100);

    return test_score + match_score - length_score;
}

genetic.generation = function(pop) {
    // Terminate once all test cases are passed
    let solution = this.userData.testCases.length * 100 + 100;
    return pop[0].fitness !== solution;
}

genetic.notification = function(pop, generation, stats, isDone) {
    const escodegen = require('escodegen');
    const ast = pop[0].entity; // AST
    const code = escodegen.generate(ast);

    fitnessData.push(stats.maximum);
    
    console.log(`Generation ${generation}, Best Fitness ${stats.maximum}, Best individual: ${code}`);
  
    if (isDone) {
        this.userData.testCases.forEach(testCase => {
            const result = this.userData.manager.evaluateCode(code, testCase);
            console.log(testCase);
            console.log(`Result: ${result}`);
        });
    }
  }

// Running the GA by calling evolve method
genetic.evolve({
    iterations: 10000,
    size: 100,
    crossover: 0.5,
    mutation: 0.5,
}, {
    manager: utilityManager,
    testCases: testCases,
    maxTreeDepth: 15,
})

// ----- OUTPUT FITNESS + FORMULA TO TXT FILES -----
fs.writeFile('Fitness.txt', fitnessData.toString(), (err) => {
    if (err) throw err;
})
  
fs.writeFile('Solution.txt', utilityManager.solution, (err) => {
    if (err) throw err;
})

