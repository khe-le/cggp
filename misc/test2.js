
const esprima = require('esprima');
const recast = require('recast');
const util = require('util')
const escodegen = require('escodegen');





const binExp = {
  "type": "BinaryExpression",
  "operator": "===",
  "left": {},
  "right": {}
}

const i = {
  "type": "Identifier",
  "name": "x"
}

const l = {
  "type": "Literal",
  "value": 2,
  "raw": "2"
}

let ast = {
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
                  "type": "Literal",
                  "value": 1000,
                  "raw": "1000"
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



// Code string => AST
// const ast = esprima.parseScript(code);


// --- DEEP COPY + MODIFY MAIN ---
let result = JSON.parse(JSON.stringify(ast));

const newTest = {
  "type": "BinaryExpression",
  "operator": "===",
  "left": { "type": "Literal", "value": 3, "raw": "3" },
  "right": {
    "type": "BinaryExpression",
    "operator": "%",
    "left": { "type": "Identifier", "name": "x" },
    "right": { "type": "Identifier", "name": "x" }
  }
}





// const myTests =  [["1000", "even"], ["7", "odd"],["-30", "even"]
//                 ["12", "even"],["999", "odd"],["0", "even"]]

// // let code = recast.print(ast).code;
// let s1 = 'function foo(){if(1000%2===0){return"even";}else{return"odd";}}foo();'
// let s2 = 'function foo(){if(7%2===0){return"even";}else{return"odd";}}foo();'
// let s3 = 'function foo(){if(-30%2===0){return"even";}else{return"odd";}}foo();'
// let s4 = 'function foo(){if(12%2===0){return"even";}else{return"odd";}}foo();'
// let s5 = 'function foo(){if(999%2===0){return"even";}else{return"odd";}}foo();'
// let s6 = 'function foo(){if(0%2===0){return"even";}else{return"odd";}}foo();'

// console.log(eval(s1))
// console.log(eval(s2))
// console.log(eval(s3))
// console.log(eval(s4))
// console.log(eval(s5))
// console.log(eval(s6))

// ----- SEED TEST ----
const utilityManager = {
  solution: 'function main(){if(x%2===0){return"even";}else{return"odd";}}main();',
  operators: '%-+*/',
  identifier: 'x',
  literals: '123456789',

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
      const val = this.literals[Math.floor(Math.random() * this.literals.length)]
      const node = {
          "type": "Literal",
          "value": Number(val),
          "raw": val
      }
      return node;
  },

  getBinaryExp: function() {
      const operator = this.operators[Math.floor(Math.random() * this.operators.length)];
      const node = {
          "type": "BinaryExpression",
          "operator": operator,
          "left": {},
          "right": {}
      }
      return node;
  }
}

const mySeed = function() {
  const getSubtree = (maxD, d) => { // recursively generate subtrees
      let subtree = {};
      if (d > maxD) { // base case => generate either x or literal node
          let rand = Math.floor(Math.random() * 2); // this gives either 0 or 1
          subtree = rand ? utilityManager.getIdentifierNode() : utilityManager.getLiteralNode();
      }
      else {
          let rand = Math.floor(Math.random() * 2);
          if (rand) {
              let rand2 = Math.floor(Math.random() * 2);
              subtree = rand2 ? utilityManager.getIdentifierNode() : utilityManager.getLiteralNode();
          }
          else {
              subtree = utilityManager.getBinaryExp();
              // Recursively add right and left children if node is a binary expression
              subtree.left = getSubtree(maxD, d + 1);
              subtree.right = getSubtree(maxD, d + 1);
          }
      }
      return subtree; // an object {...}
  }

  const tree = (maxDepth) => {
      let result = JSON.parse(JSON.stringify(utilityManager.getASTRoot()));
      const leftSubtree = getSubtree(maxDepth, depth=0);
      const rightSubtree = getSubtree(maxDepth, depth=0);

      result.body[0].body.body[0].test.left = leftSubtree;
      result.body[0].body.body[0].test.right = rightSubtree;

      return result;
  }

  return tree(2); // a complete AST
}

const crossover = function(parent1, parent2) {
  let p1_leftSubtree = parent1.body[0].body.body[0].test.left;
  let p2_leftSubtree = parent2.body[0].body.body[0].test.left;
  let p1_rightSubtree = parent1.body[0].body.body[0].test.right;
  let p2_rightSubtree = parent2.body[0].body.body[0].test.right;

  let child1 = utilityManager.getASTRoot();
  let child2 = utilityManager.getASTRoot();


  child1.body[0].body.body[0].test.left = p2_leftSubtree;
  child1.body[0].body.body[0].test.right = p1_rightSubtree;

  child2.body[0].body.body[0].test.left = p1_leftSubtree;
  child2.body[0].body.body[0].test.right = p2_rightSubtree;

  return [child1,child2];
}

// Function to get the count of nodes
// in complete binary tree
const totalNodes = (root) => {
  if (root === null) {
      return 0;
  }

  let l = root.left? totalNodes(root.left) : totalNodes(null);
  let r = root.right? totalNodes(root.right) : totalNodes(null);

  return 1 + l + r;
};


let flag = 0;

// function to find the N-th node in the preorder
// traversal of a given binary tree
function getNthNodePreorder(root, N)
{
  if (root == null)
      return;

  if (flag <= N){
    flag++;

    // mutate the n-th node
    if (flag == N)
        if (root.type === "Literal"){ // ---> Literal node
          // Replace with a literal
            let val = utilityManager.literals[Math.floor(Math.random() * utilityManager.literals.length)]
            root.value = Number(val);
            root.raw = val;
        }
        else if(root.type === "BinaryExpression"){ // ---> Operator node
          // Replace with an operator
          let operator = utilityManager.operators[Math.floor(Math.random() * utilityManager.operators.length)];
          root.operator = operator;
        }
    // left recursion
    root.left ? getNthNodePreorder(root.left, N) : getNthNodePreorder(null, N);
    // right recursion
    root.right ? getNthNodePreorder(root.right, N) : getNthNodePreorder(null, N);
  }
}

// --- TEST MUTATE ---
// const myAST = mySeed();

// console.log(util.inspect(myAST.body[0].body.body[0].test, {showHidden: false, depth: null, colors: true}));

// const astNodes = totalNodes(myAST.body[0].body.body[0].test);

// console.log("Total nodes is: " + astNodes);

// let rand = 1 + Math.floor(Math.random() * astNodes); // always skip 1st node
// while(rand === 1){
//   rand = 1 + Math.floor(Math.random() * astNodes);
// }

// console.log("Random nth node is: " + rand);
// getNthNodePreorder(myAST.body[0].body.body[0].test,rand);

// console.log(util.inspect(myAST.body[0].body.body[0].test, {showHidden: false, depth: null, colors: true}));


// --- PLUG IN VALUES _ EVAL ----

function evaluateCode(codeStr, testCase){
  codeStr = codeStr.replaceAll('x',testCase);
  return eval(codeStr);
}

// const myTests =  ["1000","7","-30","12","999","0","44","2","-90","-55","2003","54"];

// const myAST = mySeed();
// let myCode = escodegen.generate(myAST);

// console.log(myCode)

// const solutionCode = 'function main(){if(x%2===0){return"even";}else{return"odd";}}main();';

// const fitness = myTests.map(testCase => {
//   const target = evaluateCode(myCode, testCase);
//   const actual = evaluateCode(solutionCode, testCase);
//   console.log('Test case: x='+ testCase)
//   console.log('Solution returns: ' + actual);
//   console.log('My code returns: ' + target);

//   // Give 100 points for each test case
//   return target == actual ? 100 : 0;
// }).reduce((total, x) => { return total + x; });

// console.log('Fitness is: ' + fitness)


// --- LOG THE FULL JSON ---
// console.log(util.inspect(s, {showHidden: false, depth: null, colors: true}))


// ---- AST to CODE -----
// result.body[0].body.body[0].test = newTest;

// const regeneratedCode = escodegen.generate(result);
// console.log(regeneratedCode);

editDistance = function(s1, s2) {
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

similarity = function(s1, s2) {
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
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}


const s = 'function main(){if(x%2===0){return"even";}else{return"odd";}}main();';
const myAST = mySeed();
let myCode = escodegen.generate(myAST);

const actualCode = s.replaceAll((/  |\r\n|\n|\r|\s/gm),'');
const targetCode = myCode.replace((/  |\r\n|\n|\r|\s/gm),'');

console.log(actualCode);

console.log(targetCode);


// Lower fitness score if target code is either longer or shorter than solution length
const length_score = actualCode.length - Math.abs(actualCode.length - targetCode.length);
// Add percentage of matching level: +100 if identical
const match_score = Math.round(similarity(targetCode,actualCode)*100);

console.log(length_score);
console.log(match_score);
