# Math Expressions and Formulas Generation with Genetic Programming

##### Authors: Khe Le & Sylvia Le

### Setting Up
- first install `npm` and `node`
- use `npm` to install `genetic-js`library
- from command line run: `node gp_equation.js` or `node gp_prefix.js`

### About gp_prefix.js
- This JS script uses GP to learn to generate a math expression that results in a discrete value

### About gp_formula.js
- This JS script uses GP to learns a math formula, for example, `x*x-y`
- We set a test case for each of x=1 through x=5 and y=1 through y=5

##### Fitness Graph of `gp_formula.js`
- After the GP finishes running, run `graph.py` to plot the fitness results
- Example result & fitnesses of `x*x-y`:

![Result with test cases](https://drive.google.com/uc?id=1vxIIYMw6lt3GMrLDoORzWeCw3xBv3gKq)
![Example graph](https://drive.google.com/uc?id=1BvKM-nvo7lMcCrtyDWOklawMKcSmsBHp)