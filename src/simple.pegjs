/*

let a = (x, y) => [(), [], (2 * (x + 4), y)]
let b = map (x => x * x, 3, [(1, 2), (3, 4)])

*/

Start
  = (AssignmentStatement LineTerminator)*

_
  = WhiteSpace*

WhiteSpace "whitespace"
  = " "

LineTerminator
  = [\n\r]

Identifier
  = name:[a-z][a-z0-9]*

NumericLiteral
  = literal:[0-9]+ ("." [0-9]+)?

ArrayLiteralX
  = "[" _ head:Expression tail:(_ "," _ Expression)* _ "]"
  / "[]"

ArrayLiteral
  = "[" _ array:(Expression (_ "," _ Expression)*)? _ "]" {
      return array ? array[1].reduce((r, e) => [...r, e[3][0]], array[0]) : []
    }

TupleLiteral
  = "(" _ head:Expression _ tail:(_ "," _ Expression)+ _ ")"
  / "()"

ParameterList
  = head:Identifier tail:(_ "," _ Identifier)*

FunctionParameterList
  = "(" _ params:(ParameterList _)? ")"
  / params:Identifier

FunctionLiteral
  = head:FunctionParameterList _ "=>" _ body:Expression

Literal
  = FunctionLiteral
  / TupleLiteral
  / ArrayLiteral
  / NumericLiteral

PrimaryExpression
  = Literal
  / Identifier
  / "(" _ expression:Expression _ ")"

MultiplicativeExpression
  = head:PrimaryExpression tail:(_ ("*" / "/") _ PrimaryExpression)*

AdditiveExpression
  = head:MultiplicativeExpression tail:(_ ("+" / "-") _ MultiplicativeExpression)*

ApplicationExpression
  = Identifier _ TupleLiteral

Expression
  = ApplicationExpression
  / AdditiveExpression

PatternExpression
  = Identifier

AssignmentStatement
  = "let" _ left:PatternExpression _ "=" !"=" _ right:Expression
