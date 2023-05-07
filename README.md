# Code Generation with Genetic Programming

##### Authors: Khe Le & Sylvia Le

### Setting Up
- first install `npm` and `node`
- use `npm` to install libraries: `esprima`, `genetic-js`, `escodegen`
- from command line run: `node gp_codegen.js`

### Fitness Graph
- After the GP finishes running, run `graph.py` to plot the fitness results
- Example result & fitnesses:

![Example result](https://drive.google.com/uc?id=1-Zf4OCaRiNFujOyaFF6EstjwZHmW8pmf)
![Result with test cases](https://drive.google.com/uc?id=1ukA3Z0Lu7e6CEowIE3BXEqc0VDbrvV7n)
![Example graph](https://drive.google.com/uc?id=1SjJx7iI9A8aTc_fkhoJsk-qZetpBG5uT)

### The Code
##### About `gp_codegen.js`
This JS script uses genetic programming to build a function that checks whether an integter x is divisible by 2. 
```js
// How the solution looks like
function main(){
    if (x % 2 === 0) {
        return "even";
    }
    else {
        return "odd";
    }
}
main();

// The stringified solution
solution = 'function main(){if(x%2===0){return"even";}else{return"odd";}}main();'
// Tokens used
[
    {"type": "Keyword",     "value": "function"},
    {"type": "Identifier",  "value": "main"},
    {"type": "Punctuator",  "value": "("},
    {"type": "Punctuator",  "value": ")"},
    {"type": "Punctuator",  "value": "}"},
    {"type": "Punctuator",  "value": "{"},
    {"type": "Keyword",     "value": "if"},
    {"type": "Identifier",  "value": "x"},
    {"type": "Punctuator",  "value": "%"},
    {"type": "Numeric",     "value": "2"},
    {"type": "Punctuator",  "value": "==="},
    {"type": "Numeric",     "value": "0"},
    {"type": "Keyword",     "value": "return"},
    {"type": "String",      "value": "\"even\""},
    {"type": "Keyword",     "value": "else"},
    {"type": "String",      "value": "\"odd\""},
    {"type": "Punctuator",  "value": ";"},
]
// Abstract Syntax Tree of solution
{
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
              "left": {
                "type": "BinaryExpression",
                "operator": "%",
                "left": {
                  "type": "Identifier",
                  "name": "x"
                },
                "right": {
                  "type": "Literal",
                  "value": 2,
                  "raw": "2"
                }
              },
              "right": {
                "type": "Literal",
                "value": 0,
                "raw": "0"
              }
            },
            "consequent": {
              "type": "BlockStatement",
              "body": [
                {
                  "type": "ReturnStatement",
                  "argument": {
                    "type": "Literal",
                    "value": "even",
                    "raw": "\"even\""
                  }
                }
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
```
### Functions

##### `genetic.seed`
- Use recursion to generate a random code AST given a max tree depth (user-specified)
- Node types: Identifier (`x`), Literal (`1 to 9`), and BinaryExpression/Operator (`%+-*/`)
- Node type is chosen randomly during generation, but the first node is always a BinaryExpression
- Root node is created first, then generate left and right subtrees
- If node generated is Operator then it must have left and right subtrees
- If node generated is Literal or Identifier then stop generating
- Return a randomly generated AST
```js
genetic.seed = function() {
    const getSubtree = (maxD, d) => {...} // recursively generate subtrees

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
```


##### `genetic.crossover`
- Perform crossover on two parent ASTs, swapping their left and right subtrees
- Specifically, swap the left and right parts of `===` in the `if` statement
- Return two ASTs after crossover
- Currently doing 2 crossover styles:
```js
// Example 1:
let p1 = 'aaayyy';
let p2 = 'cccxxx';

// Crossover style 1:
p1 = 'aaaxxx'
p2 = 'cccyyy'

// Crossover style 2:
p1 = 'xxxyyy'
p2 = 'cccaaa'
```


##### `genetic.mutate`
- Find n total nodes in AST and pick a random node ith (1 < i <= n) to mutate
- If node to mutate is Literal, replace with a Literal
- If node to mutate is Operator, replace with an Operator
- No mutation on Identifier nodes
- Return a mutated AST
```js
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
```


##### `genetic.fitness`
- Fitness is calculated with `test_score`, `length_score`, and `match_score`
- `test_score`: Add 100 for each passed test case, therefore max test score is number of test cases * 100
- `length_score`: Minus y points if code has y fewer or more characters than solution
- `match_score`: Add y points if code is y% similar to solution
- Max fitness is (100 * t) + 100, where t is the total test cases
- Since each code individual is represented by an AST, it is alway evaluable
- Return an integer value
- Side note: Improve fitness by enhancing crossover, mutation mechanisms, adjusting their rates, or increasing interations number, population size


##### `genetic.generation`
- Return `false` to keep the program going
- Return `true` to terminate it once max fitness is achieved


##### `genetic.notification`
- Log every generation with its best individual
- The last logged individual will come with test case results


##### `genetic.evolve`
- Set GP parameters and variables
- `manager` contains solutions, node types, helper functions
- `testCases` contains user-provided tests
- `maxTreeDepth` user-provided max depth of an AST

### Libraries References
[genetic-js](https://github.com/subprotocol/genetic-js): Advanced genetic and evolutionary algorithm library written in Javascript
[esprima](https://esprima.org/index.html): ECMAScript Parser 
[escodegen](https://github.com/estools/escodegen): ECMAScript Code Generator 
