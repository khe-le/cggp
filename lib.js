const convert_infix_to_prefix = (infix) => {
    // Const Variables
    const operators = {
        "^": 4,
        "*": 3,
        "/": 3,
        "%": 3,
        "+": 2,
        "-": 2,
        "(": 1,
        ")": 1
    };

    // Variables
    let stack = [];
    let prefix = [];

    // Functions
    const is_operator = (c) => c in operators;
    const is_digit = (c) => c >= '0' && c <= '9';
    const is_identifier = (c) => (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
    const is_space = (c) => c == ' ';
    const is_left_parenthesis = (c) => c == '(';
    const is_right_parenthesis = (c) => c == ')';
    const is_left_associative = (c) => c == '+' || c == '-' || c == '*' || c == '/' || c == '%';
    const is_right_associative = (c) => c == '^';
    const is_associative = (c) => is_left_associative(c) || is_right_associative(c);
    const is_higher_precedence = (c1, c2) => {
        if (is_left_associative(c1) && operators[c1] == operators[c2]) return true;
        return operators[c1] > operators[c2];
    };

    // Main Body
    for (let i = 0; i < infix.length; i++) {
        let c = infix[i];
        if (is_digit(c)) {
            let number = c;
            while (i + 1 < infix.length && is_digit(infix[i + 1])) {
                number += infix[i + 1];
                i++;
            }
            prefix.push(number);
        } else if (is_identifier(c)) {
            let identifier = c;
            while (i + 1 < infix.length && is_identifier(infix[i + 1])) {
                identifier += infix[i + 1];
                i++;
            }
            prefix.push(identifier);
        } else if (is_space(c)) {
            continue;
        } else if (is_operator(c)) {
            while (stack.length > 0 && is_higher_precedence(stack[stack.length - 1], c)) {
                prefix.push(stack.pop());
            }
            stack.push(c);
        } else if (is_left_parenthesis(c)) {
            stack.push(c);
        } else if (is_right_parenthesis(c)) {
            while (stack.length > 0 && !is_left_parenthesis(stack[stack.length - 1])) {
                prefix.push(stack.pop());
            }
            stack.pop();
        }
    }

    while (stack.length > 0) {
        prefix.push(stack.pop());
    }

    return prefix.reverse();
};


// CONVERTING PREFIX to INFIX

// Function to check if character
// is operator or not
function isOperator(x)
{
    switch(x)
    {
        case '+':
        case '-':
        case '*':
        case '/':
        case '^':
        case '%':
            return true;
    }
    return false;
}

// Convert prefix to Infix expression
function convert_prefix_to_infix(str)
{
    let stack = [];

    // Length of expression
    let l = str.length;

    // Reading from right to left
    for(let i = l - 1; i >= 0; i--)
    {
        let c = str[i];

        if (isOperator(c))
        {
            let op1 = stack[stack.length - 1];
            stack.pop()
            let op2 = stack[stack.length - 1];
            stack.pop()

            // Concat the operands and operator
            let temp = "(" + op1 + c + op2 + ")";
            stack.push(temp);
        }
        else
        {

            // To make character to string
            stack.push(c + "");
        }
    }
    return stack[stack.length - 1];
}

module.exports = { convert_infix_to_prefix, convert_prefix_to_infix }

