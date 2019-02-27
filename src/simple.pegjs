/*

let a = (x, y) => [(), [], (2 * (x + 4), y)]
let b = map (x => x * x, 3, [(1, 2), (3, 4)])
let c = [(a + 2)..(b * 4), map (x => x * x)]

*/

{
  function buildBinaryExpression(head, tail) {
    return tail.reduce(function (result, element) {
      return {
        type: "BinaryExpression",
        operator: element[1],
        left: result,
        right: element[3]
      };
    }, head);
  }
  
  function AssignmentStatement(left, right) {
    this.type = 'AssignmentStatement'
    this.left = left
    this.right = right
  }
}

Start
  = statements:(AssignmentStatement LineTerminator)* {
      return statements.reduce((r, e) => [...r, e[0]], [])
    }

_
  = WhiteSpace*

WhiteSpace "whitespace"
  = " "

LineTerminator
  = [\n\r]

Identifier
  = name:([a-z][a-z0-9]*) { return text() }

NumericLiteral
  = literal:[0-9]+ ("." !"." [0-9]+)? { return Number(text()) }

ArrayLiteral
  = "[" _ array:(Expression (_ "," _ Expression)*)? _ "]" {
      return {
        type: "ArrayLiteral",
        elements: array ? array[1].reduce((r, e) => [...r, e[3]], [array[0]]) : []
      }
    }

TupleLiteral
  = "(" _ tuple:(Expression (_ "," _ Expression)+)? _ ")" {
      return {
        type: "TupleExpression",
        elements: tuple ? tuple[1].reduce((r, e) => [...r, e[3]], [tuple[0]]) : []
      }
    }

ParameterList
  = "(" _ params:(Expression (_ "," _ Expression)*)? _ ")" {
      return {
        type: "ParameterList",
        elements: params ? params[1].reduce((r, e) => [...r, e[3]], [params[0]]) : []
      }
    }
  / params:Identifier

FunctionLiteral
  = params:ParameterList _ "=>" _ body:Expression {
      return {
        type: "FunctionLiteral",
        params: params,
        body: body
      }
    }

Literal
  = FunctionLiteral
  / TupleLiteral
  / ArrayLiteral
  / NumericLiteral

PrimaryExpression
  = Literal
  / Identifier
  / "(" _ expression:Expression _ ")" { return expression }

MultiplicativeExpression
  = head:PrimaryExpression tail:(_ ("*" / "/") _ PrimaryExpression)* {
      return buildBinaryExpression(head, tail)
    }

AdditiveExpression
  = head:MultiplicativeExpression tail:(_ ("+" / "-") _ MultiplicativeExpression)* {
      return buildBinaryExpression(head, tail)
    }

RangeExpression
  = head:AdditiveExpression tail:(".." Expression)* {
      return buildBinaryExpression(head, tail)
    }

ApplicationExpression
  = name:Identifier _ parameter:Expression {
      return {
        type: "ApplicationExpression",
        name: name,
        parameter: parameter
      }
    }

Expression
  = ApplicationExpression
  / RangeExpression

PatternExpression
  = Identifier

AssignmentStatement
  = "let" _ left:PatternExpression _ "=" !"=" _ right:Expression {
      return new AssignmentStatement(left, right)
    }
