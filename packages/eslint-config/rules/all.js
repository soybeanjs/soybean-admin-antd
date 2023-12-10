/** @type {import('eslint').Linter.RulesRecord} */
module.exports = {
  rules: {
    /*
     * Possible Problems
     * These rules relate to possible logic errors in code
     */

    /**
     * Enforce return statements in callbacks of array methods
     *
     * @link https://eslint.org/docs/latest/rules/array-callback-return
     */
    'array-callback-return': 'error',

    /**
     * Require `super()` calls in constructors
     *
     * @link https://eslint.org/docs/latest/rules/constructor-super
     */
    'constructor-super': 'error',

    /**
     * Enforce "for" loop update clause moving the counter in the right direction.
     *
     * @link https://eslint.org/docs/latest/rules/for-direction
     */
    'for-direction': 'error',

    /**
     * Enforce `return` statements in getters
     *
     * @link https://eslint.org/docs/latest/rules/getter-return
     */
    'getter-return': 'error',

    /**
     * Disallow using an async function as a Promise executor
     *
     * @link https://eslint.org/docs/latest/rules/no-async-promise-executor
     */
    'no-async-promise-executor': 'error',

    /**
     * Disallow `await` inside of loops
     *
     * @link https://eslint.org/docs/latest/rules/no-await-in-loop
     */
    'no-await-in-loop': 'error',

    /**
     * Disallow reassigning class members
     *
     * @link https://eslint.org/docs/latest/rules/no-class-assign
     */
    'no-class-assign': 'error',

    /**
     * Disallow comparing against -0
     *
     * @link https://eslint.org/docs/latest/rules/no-compare-neg-zero
     */
    'no-compare-neg-zero': 'error',

    /**
     * Disallow assignment operators in conditional expressions
     *
     * @link https://eslint.org/docs/latest/rules/no-cond-assign
     */
    'no-cond-assign': 'error',

    /**
     * Disallow reassigning `const` variables
     *
     * @link https://eslint.org/docs/latest/rules/no-const-assign
     */
    'no-const-assign': 'error',

    /**
     * Disallow expressions where the operation doesn't affect the value
     *
     * @link https://eslint.org/docs/latest/rules/no-constant-binary-expression
     */
    'no-constant-binary-expression': 'error',

    /**
     * Disallow constant expressions in conditions
     *
     * @link https://eslint.org/docs/latest/rules/no-constant-condition
     */
    'no-constant-condition': 'error',

    /**
     * Disallow returning value from constructor
     *
     * @link https://eslint.org/docs/latest/rules/no-constructor-return
     */
    'no-constructor-return': 'error',

    /**
     * Disallow control characters in regular expressions
     *
     * @link https://eslint.org/docs/latest/rules/no-control-regex
     */
    'no-control-regex': 'error',

    /**
     * Disallow the use of `debugger`
     *
     * @link https://eslint.org/docs/latest/rules/no-debugger
     */
    'no-debugger': 'error',

    /**
     * Disallow duplicate arguments in `function` definitions
     *
     * @link https://eslint.org/docs/latest/rules/no-dupe-args
     */
    'no-dupe-args': 'error',

    /**
     * Disallow duplicate class members
     *
     * @link https://eslint.org/docs/latest/rules/no-dupe-class-members
     */
    'no-dupe-class-members': 'error',

    /**
     * Disallow duplicate conditions in if-else-if chains
     *
     * @link https://eslint.org/docs/latest/rules/no-dupe-else-if
     */
    'no-dupe-else-if': 'error',

    /**
     * Disallow duplicate keys in object literals
     *
     * @link https://eslint.org/docs/latest/rules/no-dupe-keys
     */
    'no-dupe-keys': 'error',

    /**
     * Disallow duplicate case labels
     *
     * @link https://eslint.org/docs/latest/rules/no-duplicate-case
     */
    'no-duplicate-case': 'error',

    /**
     * Disallow duplicate module imports
     *
     * @link https://eslint.org/docs/latest/rules/no-duplicate-imports
     */
    'no-duplicate-imports': 'off',

    /**
     * Disallow empty character classes in regular expressions
     *
     * @link https://eslint.org/docs/latest/rules/no-empty-character-class
     */
    'no-empty-character-class': 'error',

    /**
     * Disallow empty destructuring patterns
     *
     * @link https://eslint.org/docs/latest/rules/no-empty-pattern
     */
    'no-empty-pattern': 'error',

    /**
     * Disallow reassigning exceptions in `catch` clauses
     *
     * @link https://eslint.org/docs/latest/rules/no-ex-assign
     */
    'no-ex-assign': 'error',

    /**
     * Disallow fallthrough of `case` statements
     *
     * @link https://eslint.org/docs/latest/rules/no-fallthrough
     */
    'no-fallthrough': 'error',

    /**
     * Disallow reassigning `function` declarations
     *
     * @link https://eslint.org/docs/latest/rules/no-func-assign
     */
    'no-func-assign': 'error',

    /**
     * Disallow assigning to imported bindings
     *
     * @link https://eslint.org/docs/latest/rules/no-import-assign
     */
    'no-import-assign': 'error',

    /**
     * Disallow variable or `function` declarations in nested blocks
     *
     * @link https://eslint.org/docs/latest/rules/no-inner-declarations
     */
    'no-inner-declarations': 'error',

    /**
     * Disallow invalid regular expression strings in `RegExp` constructors
     *
     * @link https://eslint.org/docs/latest/rules/no-invalid-regexp
     */
    'no-invalid-regexp': 'error',

    /**
     * Disallow irregular whitespace
     *
     * @link https://eslint.org/docs/latest/rules/no-irregular-whitespace
     */
    'no-irregular-whitespace': 'error',

    /**
     * Disallow literal numbers that lose precision
     *
     * @link https://eslint.org/docs/latest/rules/no-loss-of-precision
     */
    'no-loss-of-precision': 'error',

    /**
     * Disallow characters which are made with multiple code points in character class syntax
     *
     * @link https://eslint.org/docs/latest/rules/no-misleading-character-class
     */
    'no-misleading-character-class': 'error',

    /**
     * Disallow `new` operators with the `Symbol` object
     *
     * @link https://eslint.org/docs/latest/rules/no-new-symbol
     */
    'no-new-symbol': 'error',

    /**
     * Disallow calling global object properties as functions
     *
     * @link https://eslint.org/docs/latest/rules/no-obj-calls
     */
    'no-obj-calls': 'error',

    /**
     * Disallow returning values from Promise executor functions
     *
     * @link https://eslint.org/docs/latest/rules/no-promise-executor-return
     */
    'no-promise-executor-return': 'error',

    /**
     * Disallow calling some `Object.prototype` methods directly on objects
     *
     * @link https://eslint.org/docs/latest/rules/no-prototype-builtins
     */
    'no-prototype-builtins': 'error',

    /**
     * Disallow assignments where both sides are exactly the same
     *
     * @link https://eslint.org/docs/latest/rules/no-self-assign
     */
    'no-self-assign': 'error',

    /**
     * Disallow comparisons where both sides are exactly the same
     *
     * @link https://eslint.org/docs/latest/rules/no-self-compare
     */
    'no-self-compare': 'error',

    /**
     * Disallow returning values from setters
     *
     * @link https://eslint.org/docs/latest/rules/no-setter-return
     */
    'no-setter-return': 'error',

    /**
     * Disallow sparse arrays
     *
     * @link https://eslint.org/docs/latest/rules/no-sparse-arrays
     */
    'no-sparse-arrays': 'error',

    /**
     * Disallow template literal placeholder syntax in regular strings
     *
     * @link https://eslint.org/docs/latest/rules/no-template-curly-in-string
     */
    'no-template-curly-in-string': 'error',

    /**
     * Disallow `this`/`super` before calling `super()` in constructors
     *
     * @link https://eslint.org/docs/latest/rules/no-this-before-super
     */
    'no-this-before-super': 'error',

    /**
     * Disallow the use of undeclared variables unless mentioned in _global_ comments
     *
     * @link https://eslint.org/docs/latest/rules/no-undef
     */
    'no-undef': 'error',

    /**
     * Disallow confusing multiline expressions
     *
     * @link https://eslint.org/docs/latest/rules/no-unexpected-multiline
     */
    'no-unexpected-multiline': 'error',

    /**
     * Disallow unmodified loop conditions
     *
     * @link https://eslint.org/docs/latest/rules/no-unmodified-loop-condition
     */
    'no-unmodified-loop-condition': 'error',

    /**
     * Disallow unreachable code after `return`, `throw`, `continue`, and `break` statements
     *
     * @link https://eslint.org/docs/latest/rules/no-unreachable
     */
    'no-unreachable': 'error',

    /**
     * Disallow loops with a body that allows only one iteration
     *
     * @link https://eslint.org/docs/latest/rules/no-unreachable-loop
     */
    'no-unreachable-loop': 'error',

    /**
     * Disallow control flow statements in `finally` blocks
     *
     * @link https://eslint.org/docs/latest/rules/no-unsafe-finally
     */
    'no-unsafe-finally': 'error',

    /**
     * Disallow negating the left operand of relational operators
     *
     * @link https://eslint.org/docs/latest/rules/no-unsafe-negation
     */
    'no-unsafe-negation': 'error',

    /**
     * Disallow use of optional chaining in contexts where the `undefined` value is not allowed
     *
     * @link https://eslint.org/docs/latest/rules/no-unsafe-optional-chaining
     */
    'no-unsafe-optional-chaining': 'error',

    /**
     * Disallow unused private class members
     *
     * @link https://eslint.org/docs/latest/rules/no-unused-private-class-members
     */
    'no-unused-private-class-members': 'error',

    /**
     * Disallow unused variables
     *
     * @link https://eslint.org/docs/latest/rules/no-unused-vars
     */
    'no-unused-vars': 'error',

    /**
     * Disallow the use of variables before they are defined
     *
     * @link https://eslint.org/docs/latest/rules/no-use-before-define
     */
    'no-use-before-define': ['error', { functions: false, classes: false, variables: true }],

    /**
     * Disallow useless backreferences in regular expressions
     *
     * @link https://eslint.org/docs/latest/rules/no-useless-backreference
     */
    'no-useless-backreference': 'error',

    /**
     * Disallow assignments that can lead to race conditions due to usage of `await` or `yield`
     *
     * @link https://eslint.org/docs/latest/rules/require-atomic-updates
     */
    'require-atomic-updates': 'error',

    /**
     * Require calls to `isNaN()` when checking for `NaN`
     *
     * @link https://eslint.org/docs/latest/rules/use-isnan
     */
    'use-isnan': 'error',

    /**
     * Enforce comparing `typeof` expressions against valid strings
     *
     * @link https://eslint.org/docs/latest/rules/valid-typeof
     */
    'valid-typeof': 'error',

    // End

    /*
     * Suggestions
     * These rules suggest alternate ways of doing things:
     */

    /**
     * Enforce getter and setter pairs in objects and classes
     *
     * @link https://eslint.org/docs/latest/rules/accessor-pairs
     */
    'accessor-pairs': ['error', { setWithoutGet: true, enforceForClassMembers: true }],

    /**
     * Require braces around arrow function bodies
     *
     * @link https://eslint.org/docs/latest/rules/arrow-body-style
     */
    'arrow-body-style': 'error',

    /**
     * Enforce the use of variables within the scope they are defined
     *
     * @link https://eslint.org/docs/latest/rules/block-scoped-var
     */
    'block-scoped-var': 'error',

    /**
     * Enforce camelcase naming convention
     *
     * @link https://eslint.org/docs/latest/rules/camelcase
     */
    camelcase: 'off',

    /**
     * Enforce or disallow capitalization of the first letter of a comment
     *
     * @link https://eslint.org/docs/latest/rules/capitalized-comments
     */
    'capitalized-comments': 'off',

    /**
     * Enforce that class methods utilize `this`
     *
     * @link https://eslint.org/docs/latest/rules/class-methods-use-this
     */
    'class-methods-use-this': 'error',

    /**
     * Enforce a maximum cyclomatic complexity allowed in a program
     *
     * @link https://eslint.org/docs/latest/rules/complexity
     */
    complexity: 'error',

    /**
     * Require `return` statements to either always or never specify values
     *
     * @link https://eslint.org/docs/latest/rules/consistent-return
     */
    'consistent-return': 'error',

    /**
     * Enforce consistent naming when capturing the current execution context
     *
     * @link https://eslint.org/docs/latest/rules/consistent-this
     */
    'consistent-this': 'error',

    /**
     * Enforce consistent brace style for all control statements
     *
     * @link https://eslint.org/docs/latest/rules/curly
     */
    curly: 'error',

    /**
     * Require `default` cases in `switch` statements
     *
     * @link https://eslint.org/docs/latest/rules/default-case
     */
    'default-case': 'error',

    /**
     * Enforce default clauses in switch statements to be last
     *
     * @link https://eslint.org/docs/latest/rules/default-case-last
     */
    'default-case-last': 'error',

    /**
     * Enforce default parameters to be last
     *
     * @link https://eslint.org/docs/latest/rules/default-param-last
     */
    'default-param-last': 'error',

    /**
     * Enforce dot notation whenever possible
     *
     * @link https://eslint.org/docs/latest/rules/dot-notation
     */
    'dot-notation': 'error',

    /**
     * Require the use of `===` and `!==`
     *
     * @link https://eslint.org/docs/latest/rules/eqeqeq
     */
    eqeqeq: 'error',

    /**
     * Require function names to match the name of the variable or property to which they are assigned
     *
     * @link https://eslint.org/docs/latest/rules/func-name-matching
     */
    'func-name-matching': 'error',

    /**
     * Require or disallow named `function` expressions
     *
     * @link https://eslint.org/docs/latest/rules/func-names
     */
    'func-names': 'error',

    /**
     * Enforce the consistent use of either `function` declarations or expressions
     *
     * @link https://eslint.org/docs/latest/rules/func-style
     */
    'func-style': 'off',

    /**
     * Require grouped accessor pairs in object literals and classes
     *
     * @link https://eslint.org/docs/latest/rules/grouped-accessor-pairs
     */
    'grouped-accessor-pairs': 'error',

    /**
     * Require `for-in` loops to include an `if` statement
     *
     * @link https://eslint.org/docs/latest/rules/guard-for-in
     */
    'guard-for-in': 'error',

    /**
     * Disallow specified identifiers
     *
     * @link https://eslint.org/docs/latest/rules/id-denylist
     */
    'id-denylist': 'error',

    /**
     * Enforce minimum and maximum identifier lengths
     *
     * @link https://eslint.org/docs/latest/rules/id-length
     */
    'id-length': 'off',

    /**
     * Require identifiers to match a specified regular expression
     *
     * @link https://eslint.org/docs/latest/rules/id-match
     */
    'id-match': 'error',

    /**
     * Require or disallow initialization in variable declarations
     *
     * @link https://eslint.org/docs/latest/rules/init-declarations
     */
    'init-declarations': 'off',

    /**
     * Enforce a maximum number of classes per file
     *
     * @link https://eslint.org/docs/latest/rules/max-classes-per-file
     */
    'max-classes-per-file': 'off',

    /**
     * Enforce a maximum depth that blocks can be nested
     *
     * @link https://eslint.org/docs/latest/rules/max-depth
     */
    'max-depth': 'error',

    /**
     * Enforce a maximum number of lines per file
     *
     * @link https://eslint.org/docs/latest/rules/max-lines
     */
    'max-lines': 'off',

    /**
     * Enforce a maximum number of lines of code in a function
     *
     * @link https://eslint.org/docs/latest/rules/max-lines-per-function
     */
    'max-lines-per-function': 'off',

    /**
     * Enforce a maximum depth that callbacks can be nested
     *
     * @link https://eslint.org/docs/latest/rules/max-nested-callbacks
     */
    'max-nested-callbacks': 'error',

    /**
     * Enforce a maximum number of parameters in function definitions
     *
     * @link https://eslint.org/docs/latest/rules/max-params
     */
    'max-params': 'error',

    /**
     * Enforce a maximum number of statements allowed in function blocks
     *
     * @link https://eslint.org/docs/latest/rules/max-statements
     */
    'max-statements': 'off',

    /**
     * Enforce a particular style for multiline comments
     *
     * @link https://eslint.org/docs/latest/rules/multiline-comment-style
     */
    'multiline-comment-style': 'off',

    /**
     * Require constructor names to begin with a capital letter
     *
     * @link https://eslint.org/docs/latest/rules/new-cap
     */
    'new-cap': ['error', { newIsCap: true, capIsNew: false, properties: true }],

    /**
     * Disallow the use of `alert`, `confirm`, and `prompt`
     *
     * @link https://eslint.org/docs/latest/rules/no-alert
     */
    'no-alert': 'error',

    /**
     * Disallow `Array` constructors
     *
     * @link https://eslint.org/docs/latest/rules/no-array-constructor
     */
    'no-array-constructor': 'error',

    /**
     * Disallow bitwise operators
     *
     * @link https://eslint.org/docs/latest/rules/no-bitwise
     */
    'no-bitwise': 'error',

    /**
     * Disallow the use of `arguments.caller` or `arguments.callee`
     *
     * @link https://eslint.org/docs/latest/rules/no-caller
     */
    'no-caller': 'error',

    /**
     * Disallow lexical declarations in case clauses
     *
     * @link https://eslint.org/docs/latest/rules/no-case-declarations
     */
    'no-case-declarations': 'error',

    /**
     * Disallow arrow functions where they could be confused with comparisons
     *
     * @link https://eslint.org/docs/latest/rules/no-confusing-arrow
     */
    'no-confusing-arrow': 'error',

    /**
     * Disallow the use of `console`
     *
     * @link https://eslint.org/docs/latest/rules/no-console
     */
    'no-console': 'warn',

    /**
     * Disallow `continue` statements
     *
     * @link https://eslint.org/docs/latest/rules/no-continue
     */
    'no-continue': 'error',

    /**
     * Disallow deleting variables
     *
     * @link https://eslint.org/docs/latest/rules/no-delete-var
     */
    'no-delete-var': 'error',

    /**
     * Disallow division operators explicitly at the beginning of regular expressions
     *
     * @link https://eslint.org/docs/latest/rules/no-div-regex
     */
    'no-div-regex': 'error',

    /**
     * Disallow `else` blocks after `return` statements in `if` statements
     *
     * @link https://eslint.org/docs/latest/rules/no-else-return
     */
    'no-else-return': 'error',

    /**
     * Disallow empty block statements
     *
     * @link https://eslint.org/docs/latest/rules/no-empty
     */
    'no-empty': [
      'error',
      {
        allowEmptyCatch: true
      }
    ],

    /**
     * Disallow empty functions
     *
     * @link https://eslint.org/docs/latest/rules/no-empty-function
     */
    'no-empty-function': 'error',

    /**
     * Disallow `null` comparisons without type-checking operators
     *
     * @link https://eslint.org/docs/latest/rules/no-eq-null
     */
    'no-eq-null': 'error',

    /**
     * Disallow the use of `eval()`
     *
     * @link https://eslint.org/docs/latest/rules/no-eval
     */
    'no-eval': 'error',

    /**
     * Disallow extending native types
     *
     * @link https://eslint.org/docs/latest/rules/no-extend-native
     */
    'no-extend-native': 'error',

    /**
     * Disallow unnecessary calls to `.bind()`
     *
     * @link https://eslint.org/docs/latest/rules/no-extra-bind
     */
    'no-extra-bind': 'error',

    /**
     * Disallow unnecessary boolean casts
     *
     * @link https://eslint.org/docs/latest/rules/no-extra-boolean-cast
     */
    'no-extra-boolean-cast': 'error',

    /**
     * Disallow unnecessary labels
     *
     * @link https://eslint.org/docs/latest/rules/no-extra-label
     */
    'no-extra-label': 'error',

    /**
     * Disallow unnecessary semicolons
     *
     * @link https://eslint.org/docs/latest/rules/no-extra-semi
     */
    'no-extra-semi': 'error',

    /**
     * Disallow leading or trailing decimal points in numeric literals
     *
     * @link https://eslint.org/docs/latest/rules/no-floating-decimal
     */
    'no-floating-decimal': 'error',

    /**
     * Disallow assignments to native objects or read-only global variables
     *
     * @link https://eslint.org/docs/latest/rules/no-global-assign
     */
    'no-global-assign': 'error',

    /**
     * Disallow shorthand type conversions
     *
     * @link https://eslint.org/docs/latest/rules/no-implicit-coercion
     */
    'no-implicit-coercion': 'error',

    /**
     * Disallow declarations in the global scope
     *
     * @link https://eslint.org/docs/latest/rules/no-implicit-globals
     */
    'no-implicit-globals': 'error',

    /**
     * Disallow the use of `eval()`-like methods
     *
     * @link https://eslint.org/docs/latest/rules/no-implied-eval
     */
    'no-implied-eval': 'error',

    /**
     * Disallow inline comments after code
     *
     * @link https://eslint.org/docs/latest/rules/no-inline-comments
     */
    'no-inline-comments': 'off',

    /**
     * Disallow use of `this` in contexts where the value of `this` is `undefined`
     *
     * @link https://eslint.org/docs/latest/rules/no-invalid-this
     */
    'no-invalid-this': 'error',

    /**
     * Disallow the use of the `__iterator__` property
     *
     * @link https://eslint.org/docs/latest/rules/no-iterator
     */
    'no-iterator': 'error',

    /**
     * Disallow labels that share a name with a variable
     *
     * @link https://eslint.org/docs/latest/rules/no-label-var
     */
    'no-label-var': 'error',

    /**
     * Disallow labeled statements
     *
     * @link https://eslint.org/docs/latest/rules/no-labels
     */
    'no-labels': 'error',

    /**
     * Disallow unnecessary nested blocks
     *
     * @link https://eslint.org/docs/latest/rules/no-lone-blocks
     */
    'no-lone-blocks': 'error',

    /**
     * Disallow `if` statements as the only statement in `else` blocks
     *
     * @link https://eslint.org/docs/latest/rules/no-lonely-if
     */
    'no-lonely-if': 'error',

    /**
     * Disallow function declarations that contain unsafe references inside loop statements
     *
     * @link https://eslint.org/docs/latest/rules/no-loop-func
     */
    'no-loop-func': 'error',

    /**
     * Disallow magic numbers
     *
     * @link https://eslint.org/docs/latest/rules/no-magic-numbers
     */
    'no-magic-numbers': 'off',

    /**
     * Disallow mixed binary operators
     *
     * @link https://eslint.org/docs/latest/rules/no-mixed-operators
     */
    'no-mixed-operators': [
      'error',
      {
        groups: [
          ['+', '-', '*', '/', '%', '**'],
          ['&', '|', '^', '~', '<<', '>>', '>>>'],
          ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
          ['&&', '||'],
          ['in', 'instanceof']
        ],
        allowSamePrecedence: true
      }
    ],

    /**
     * Disallow use of chained assignment expressions
     *
     * @link https://eslint.org/docs/latest/rules/no-multi-assign
     */
    'no-multi-assign': 'error',

    /**
     * Disallow multiline strings
     *
     * @link https://eslint.org/docs/latest/rules/no-multi-str
     */
    'no-multi-str': 'error',

    /**
     * Disallow negated conditions
     *
     * @link https://eslint.org/docs/latest/rules/no-negated-condition
     */
    'no-negated-condition': 'off',

    /**
     * Disallow nested ternary expressions
     *
     * @link https://eslint.org/docs/latest/rules/no-nested-ternary
     */
    'no-nested-ternary': 'error',

    /**
     * Disallow `new` operators outside of assignments or comparisons
     *
     * @link https://eslint.org/docs/latest/rules/no-new
     */
    'no-new': 'error',

    /**
     * Disallow `new` operators with the `Function` object
     *
     * @link https://eslint.org/docs/latest/rules/no-new-func
     */
    'no-new-func': 'error',

    /**
     * Disallow `Object` constructors
     *
     * @link https://eslint.org/docs/latest/rules/no-new-object
     */
    'no-new-object': 'error',

    /**
     * Disallow `new` operators with the `String`, `Number`, and `Boolean` objects
     *
     * @link https://eslint.org/docs/latest/rules/no-new-wrappers
     */
    'no-new-wrappers': 'error',

    /**
     * Disallow `\\8` and `\\9` escape sequences in string literals
     *
     * @link https://eslint.org/docs/latest/rules/no-nonoctal-decimal-escape
     */
    'no-nonoctal-decimal-escape': 'error',

    /**
     * Disallow octal literals
     *
     * @link https://eslint.org/docs/latest/rules/no-octal
     */
    'no-octal': 'error',

    /**
     * Disallow octal escape sequences in string literals
     *
     * @link https://eslint.org/docs/latest/rules/no-octal-escape
     */
    'no-octal-escape': 'error',

    /**
     * Disallow reassigning `function` parameters
     *
     * @link https://eslint.org/docs/latest/rules/no-param-reassign
     */
    'no-param-reassign': 'error',

    /**
     * Disallow the unary operators `++` and `--`
     *
     * @link https://eslint.org/docs/latest/rules/no-plusplus
     */
    'no-plusplus': 'error',

    /**
     * Disallow the use of the `__proto__` property
     *
     * @link https://eslint.org/docs/latest/rules/no-proto
     */
    'no-proto': 'error',

    /**
     * Disallow variable redeclaration
     *
     * @link https://eslint.org/docs/latest/rules/no-redeclare
     */
    'no-redeclare': 'error',

    /**
     * Disallow multiple spaces in regular expressions
     *
     * @link https://eslint.org/docs/latest/rules/no-regex-spaces
     */
    'no-regex-spaces': 'error',

    /**
     * Disallow specified names in exports
     *
     * @link https://eslint.org/docs/latest/rules/no-restricted-exports
     */
    'no-restricted-exports': 'error',

    /**
     * Disallow specified global variables
     *
     * @link https://eslint.org/docs/latest/rules/no-restricted-globals
     */
    'no-restricted-globals': 'error',

    /**
     * Disallow specified modules when loaded by `import`
     *
     * @link https://eslint.org/docs/latest/rules/no-restricted-imports
     */
    'no-restricted-imports': 'error',

    /**
     * Disallow certain properties on certain objects
     *
     * @link https://eslint.org/docs/latest/rules/no-restricted-properties
     */
    'no-restricted-properties': 'error',

    /**
     * Disallow specified syntax
     *
     * @link https://eslint.org/docs/latest/rules/no-restricted-syntax
     */
    'no-restricted-syntax': ['error', 'DebuggerStatement', 'LabeledStatement', 'WithStatement'],

    /**
     * Disallow assignment operators in `return` statements
     *
     * @link https://eslint.org/docs/latest/rules/no-return-assign
     */
    'no-return-assign': 'error',

    /**
     * Disallow unnecessary `return await`
     *
     * @link https://eslint.org/docs/latest/rules/no-return-await
     */
    'no-return-await': 'error',

    /**
     * Disallow `javascript:` urls
     *
     * @link https://eslint.org/docs/latest/rules/no-script-url
     */
    'no-script-url': 'error',

    /**
     * Disallow comma operators
     *
     * @link https://eslint.org/docs/latest/rules/no-sequences
     */
    'no-sequences': 'error',

    /**
     * Disallow variable declarations from shadowing variables declared in the outer scope
     *
     * @link https://eslint.org/docs/latest/rules/no-shadow
     */
    'no-shadow': 'error',

    /**
     * Disallow identifiers from shadowing restricted names
     *
     * @link https://eslint.org/docs/latest/rules/no-shadow-restricted-names
     */
    'no-shadow-restricted-names': 'error',

    /**
     * Disallow ternary operators
     *
     * @link https://eslint.org/docs/latest/rules/no-ternary
     */
    'no-ternary': 'off',

    /**
     * Disallow throwing literals as exceptions
     *
     * @link https://eslint.org/docs/latest/rules/no-throw-literal
     */
    'no-throw-literal': 'error',

    /**
     * Disallow initializing variables to `undefined`
     *
     * @link https://eslint.org/docs/latest/rules/no-undef-init
     */
    'no-undef-init': 'error',

    /**
     * Disallow the use of `undefined` as an identifier
     *
     * @link https://eslint.org/docs/latest/rules/no-undefined
     */
    'no-undefined': 'off',

    /**
     * Disallow dangling underscores in identifiers
     *
     * @link https://eslint.org/docs/latest/rules/no-underscore-dangle
     */
    'no-underscore-dangle': 'error',

    /**
     * Disallow ternary operators when simpler alternatives exist
     *
     * @link https://eslint.org/docs/latest/rules/no-unneeded-ternary
     */
    'no-unneeded-ternary': 'error',

    /**
     * Disallow unused expressions
     *
     * @link https://eslint.org/docs/latest/rules/no-unused-expressions
     */
    'no-unused-expressions': 'error',

    /**
     * Disallow unused labels
     *
     * @link https://eslint.org/docs/latest/rules/no-unused-labels
     */
    'no-unused-labels': 'error',

    /**
     * Disallow unnecessary calls to `.call()` and `.apply()`
     *
     * @link https://eslint.org/docs/latest/rules/no-useless-call
     */
    'no-useless-call': 'error',

    /**
     * Disallow unnecessary `catch` clauses
     *
     * @link https://eslint.org/docs/latest/rules/no-useless-catch
     */
    'no-useless-catch': 'error',

    /**
     * Disallow unnecessary computed property keys in objects and classes
     *
     * @link https://eslint.org/docs/latest/rules/no-useless-computed-key
     */
    'no-useless-computed-key': 'error',

    /**
     * Disallow unnecessary concatenation of literals or template literals
     *
     * @link https://eslint.org/docs/latest/rules/no-useless-concat
     */
    'no-useless-concat': 'error',

    /**
     * Disallow unnecessary constructors
     *
     * @link https://eslint.org/docs/latest/rules/no-useless-constructor
     */
    'no-useless-constructor': 'error',

    /**
     * Disallow unnecessary escape characters
     *
     * @link https://eslint.org/docs/latest/rules/no-useless-escape
     */
    'no-useless-escape': 'error',

    /**
     * Disallow renaming import, export, and destructured assignments to the same name
     *
     * @link https://eslint.org/docs/latest/rules/no-useless-rename
     */
    'no-useless-rename': 'error',

    /**
     * Disallow redundant return statements
     *
     * @link https://eslint.org/docs/latest/rules/no-useless-return
     */
    'no-useless-return': 'error',

    /**
     * Require `let` or `const` instead of `var`
     *
     * @link https://eslint.org/docs/latest/rules/no-var
     */
    'no-var': 'error',

    /**
     * Disallow `void` operators
     *
     * @link https://eslint.org/docs/latest/rules/no-void
     */
    'no-void': 'error',

    /**
     * Disallow specified warning terms in comments
     *
     * @link https://eslint.org/docs/latest/rules/no-warning-comments
     */
    'no-warning-comments': 'error',

    /**
     * Disallow `with` statements
     *
     * @link https://eslint.org/docs/latest/rules/no-with
     */
    'no-with': 'error',

    /**
     * Require or disallow method and property shorthand syntax for object literals
     *
     * @link https://eslint.org/docs/latest/rules/object-shorthand
     */
    'object-shorthand': [
      'error',
      'always',
      {
        ignoreConstructors: false,
        avoidQuotes: true
      }
    ],

    /**
     * Enforce variables to be declared either together or separately in functions
     *
     * @link https://eslint.org/docs/latest/rules/one-var
     */
    'one-var': ['error', 'never'],

    /**
     * Require or disallow newlines around variable declarations
     *
     * @link https://eslint.org/docs/latest/rules/one-var-declaration-per-line
     */
    'one-var-declaration-per-line': 'error',

    /**
     * Require or disallow assignment operator shorthand where possible
     *
     * @link https://eslint.org/docs/latest/rules/operator-assignment
     */
    'operator-assignment': 'error',

    /**
     * Require using arrow functions for callbacks
     *
     * @link https://eslint.org/docs/latest/rules/prefer-arrow-callback
     */
    'prefer-arrow-callback': 'error',

    /**
     * Require `const` declarations for variables that are never reassigned after declared
     *
     * @link https://eslint.org/docs/latest/rules/prefer-const
     */
    'prefer-const': 'error',

    /**
     * Require destructuring from arrays and/or objects
     *
     * @link https://eslint.org/docs/latest/rules/prefer-destructuring
     */
    'prefer-destructuring': 'off',

    /**
     * Disallow the use of `Math.pow` in favor of the `**` operator
     *
     * @link https://eslint.org/docs/latest/rules/prefer-exponentiation-operator
     */
    'prefer-exponentiation-operator': 'error',

    /**
     * Enforce using named capture group in regular expression
     *
     * @link https://eslint.org/docs/latest/rules/prefer-named-capture-group
     */
    'prefer-named-capture-group': 'off',

    /**
     * Disallow `parseInt()` and `Number.parseInt()` in favor of binary, octal, and hexadecimal literals
     *
     * @link https://eslint.org/docs/latest/rules/prefer-numeric-literals
     */
    'prefer-numeric-literals': 'error',

    /**
     * Disallow use of `Object.prototype.hasOwnProperty.call()` and prefer use of `Object.hasOwn()`
     *
     * @link https://eslint.org/docs/latest/rules/prefer-object-has-own
     */
    'prefer-object-has-own': 'error',

    /**
     * Disallow using Object.assign with an object literal as the first argument and prefer the use of object spread
     * instead.
     *
     * @link https://eslint.org/docs/latest/rules/prefer-object-spread
     */
    'prefer-object-spread': 'error',

    /**
     * Require using Error objects as Promise rejection reasons
     *
     * @link https://eslint.org/docs/latest/rules/prefer-promise-reject-errors
     */
    'prefer-promise-reject-errors': 'error',

    /**
     * Disallow use of the `RegExp` constructor in favor of regular expression literals
     *
     * @link https://eslint.org/docs/latest/rules/prefer-regex-literals
     */
    'prefer-regex-literals': 'error',

    /**
     * Require rest parameters instead of `arguments`
     *
     * @link https://eslint.org/docs/latest/rules/prefer-rest-params
     */
    'prefer-rest-params': 'error',

    /**
     * Require spread operators instead of `.apply()`
     *
     * @link https://eslint.org/docs/latest/rules/prefer-spread
     */
    'prefer-spread': 'error',

    /**
     * Require template literals instead of string concatenation
     *
     * @link https://eslint.org/docs/latest/rules/prefer-template
     */
    'prefer-template': 'error',

    /**
     * Require quotes around object literal property names
     *
     * @link https://eslint.org/docs/latest/rules/quote-props
     */
    'quote-props': 'error',

    /**
     * Enforce the consistent use of the radix argument when using `parseInt()`
     *
     * @link https://eslint.org/docs/latest/rules/radix
     */
    radix: 'error',

    /**
     * Disallow async functions which have no `await` expression
     *
     * @link https://eslint.org/docs/latest/rules/require-await
     */
    'require-await': 'off',

    /**
     * Enforce the use of `u` flag on RegExp
     *
     * @link https://eslint.org/docs/latest/rules/require-unicode-regexp
     */
    'require-unicode-regexp': 'off',

    /**
     * Require generator functions to contain `yield`
     *
     * @link https://eslint.org/docs/latest/rules/require-yield
     */
    'require-yield': 'error',

    /**
     * Enforce sorted import declarations within modules
     *
     * @link https://eslint.org/docs/latest/rules/sort-imports
     */
    'sort-imports': 'off',

    /**
     * Require object keys to be sorted
     *
     * @link https://eslint.org/docs/latest/rules/sort-keys
     */
    'sort-keys': 'off',

    /**
     * Require variables within the same declaration block to be sorted
     *
     * @link https://eslint.org/docs/latest/rules/sort-vars
     */
    'sort-vars': 'error',

    /**
     * Enforce consistent spacing after the `//` or `/*` in a comment
     *
     * @link https://eslint.org/docs/latest/rules/spaced-comment
     */
    'spaced-comment': [
      'error',
      'always',
      {
        line: { markers: ['*package', '!', '/', ',', '='] },
        block: {
          balanced: true,
          markers: ['*package', '!', ',', ':', '::', 'flow-include'],
          exceptions: ['*']
        }
      }
    ],

    /**
     * Require or disallow strict mode directives
     *
     * @link https://eslint.org/docs/latest/rules/strict
     */
    strict: 'error',

    /**
     * Require symbol descriptions
     *
     * @link https://eslint.org/docs/latest/rules/symbol-description
     */
    'symbol-description': 'error',

    /**
     * Require `var` declarations be placed at the top of their containing scope
     *
     * @link https://eslint.org/docs/latest/rules/vars-on-top
     */
    'vars-on-top': 'error',

    /**
     * Require or disallow "Yoda" conditions
     *
     * @link https://eslint.org/docs/latest/rules/yoda
     */
    yoda: 'error',

    // End

    /*
     * Layout & Formatting
     * These rules care about how the code looks rather than how it executes:
     */

    /**
     * Enforce linebreaks after opening and before closing array brackets
     *
     * @link https://eslint.org/docs/latest/rules/array-bracket-newline
     */
    'array-bracket-newline': 'error',

    /**
     * Enforce consistent spacing inside array brackets
     *
     * @link https://eslint.org/docs/latest/rules/array-bracket-spacing
     */
    'array-bracket-spacing': 'error',

    /**
     * Enforce line breaks after each array element
     *
     * @link https://eslint.org/docs/latest/rules/array-element-newline
     */
    'array-element-newline': 'error',

    /**
     * Require parentheses around arrow function arguments
     *
     * @link https://eslint.org/docs/latest/rules/arrow-parens
     */
    'arrow-parens': ['error', 'as-needed'],

    /**
     * Enforce consistent spacing before and after the arrow in arrow functions
     *
     * @link https://eslint.org/docs/latest/rules/arrow-spacing
     */
    'arrow-spacing': 'error',

    /**
     * Disallow or enforce spaces inside of blocks after opening block and before closing block
     *
     * @link https://eslint.org/docs/latest/rules/block-spacing
     */
    'block-spacing': 'error',

    /**
     * Enforce consistent brace style for blocks
     *
     * @link https://eslint.org/docs/latest/rules/brace-style
     */
    'brace-style': 'error',

    /**
     * Require or disallow trailing commas
     *
     * @link https://eslint.org/docs/latest/rules/comma-dangle
     */
    'comma-dangle': 'error',

    /**
     * Enforce consistent spacing before and after commas
     *
     * @link https://eslint.org/docs/latest/rules/comma-spacing
     */
    'comma-spacing': 'error',

    /**
     * Enforce consistent comma style
     *
     * @link https://eslint.org/docs/latest/rules/comma-style
     */
    'comma-style': 'error',

    /**
     * Enforce consistent spacing inside computed property brackets
     *
     * @link https://eslint.org/docs/latest/rules/computed-property-spacing
     */
    'computed-property-spacing': 'error',

    /**
     * Enforce consistent newlines before and after dots
     *
     * @link https://eslint.org/docs/latest/rules/dot-location
     */
    'dot-location': ['error', 'property'],

    /**
     * Require or disallow newline at the end of files
     *
     * @link https://eslint.org/docs/latest/rules/eol-last
     */
    'eol-last': 'error',

    /**
     * Require or disallow spacing between function identifiers and their invocations
     *
     * @link https://eslint.org/docs/latest/rules/func-call-spacing
     */
    'func-call-spacing': 'error',

    /**
     * Enforce line breaks between arguments of a function call
     *
     * @link https://eslint.org/docs/latest/rules/function-call-argument-newline
     */
    'function-call-argument-newline': 'error',

    /**
     * Enforce consistent line breaks inside function parentheses
     *
     * @link https://eslint.org/docs/latest/rules/function-paren-newline
     */
    'function-paren-newline': 'error',

    /**
     * Enforce consistent spacing around `*` operators in generator functions
     *
     * @link https://eslint.org/docs/latest/rules/generator-star-spacing
     */
    'generator-star-spacing': 'error',

    /**
     * Enforce the location of arrow function bodies
     *
     * @link https://eslint.org/docs/latest/rules/implicit-arrow-linebreak
     */
    'implicit-arrow-linebreak': 'error',

    /**
     * Enforce consistent indentation
     *
     * @link https://eslint.org/docs/latest/rules/indent
     */
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
        VariableDeclarator: 1,
        outerIIFEBody: 1,
        MemberExpression: 1,
        FunctionDeclaration: { parameters: 1, body: 1 },
        FunctionExpression: { parameters: 1, body: 1 },
        CallExpression: { arguments: 1 },
        ArrayExpression: 1,
        ObjectExpression: 1,
        ImportDeclaration: 1,
        flatTernaryExpressions: false,
        ignoreComments: false,
        ignoredNodes: [
          'TemplateLiteral *',
          'JSXElement',
          'JSXElement > *',
          'JSXAttribute',
          'JSXIdentifier',
          'JSXNamespacedName',
          'JSXMemberExpression',
          'JSXSpreadAttribute',
          'JSXExpressionContainer',
          'JSXOpeningElement',
          'JSXClosingElement',
          'JSXFragment',
          'JSXOpeningFragment',
          'JSXClosingFragment',
          'JSXText',
          'JSXEmptyExpression',
          'JSXSpreadChild'
        ],
        offsetTernaryExpressions: true
      }
    ],

    /**
     * Enforce the consistent use of either double or single quotes in JSX attributes
     *
     * @link https://eslint.org/docs/latest/rules/jsx-quotes
     */
    'jsx-quotes': 'error',

    /**
     * Enforce consistent spacing between keys and values in object literal properties
     *
     * @link https://eslint.org/docs/latest/rules/key-spacing
     */
    'key-spacing': 'error',

    /**
     * Enforce consistent spacing before and after keywords
     *
     * @link https://eslint.org/docs/latest/rules/keyword-spacing
     */
    'keyword-spacing': 'error',

    /**
     * Enforce position of line comments
     *
     * @link https://eslint.org/docs/latest/rules/line-comment-position
     */
    'line-comment-position': 'off',

    /**
     * Enforce consistent linebreak style
     *
     * @link https://eslint.org/docs/latest/rules/linebreak-style
     */
    'linebreak-style': 'error',

    /**
     * Require empty lines around comments
     *
     * @link https://eslint.org/docs/latest/rules/lines-around-comment
     */
    'lines-around-comment': 'error',

    /**
     * Require or disallow an empty line between class members
     *
     * @link https://eslint.org/docs/latest/rules/lines-between-class-members
     */
    'lines-between-class-members': 'error',

    /**
     * Enforce a maximum line length
     *
     * @link https://eslint.org/docs/latest/rules/max-len
     */
    'max-len': 'error',

    /**
     * Enforce a maximum number of statements allowed per line
     *
     * @link https://eslint.org/docs/latest/rules/max-statements-per-line
     */
    'max-statements-per-line': 'off',

    /**
     * Enforce newlines between operands of ternary expressions
     *
     * @link https://eslint.org/docs/latest/rules/multiline-ternary
     */
    'multiline-ternary': ['error', 'always-multiline'],

    /**
     * Enforce or disallow parentheses when invoking a constructor with no arguments
     *
     * @link https://eslint.org/docs/latest/rules/new-parens
     */
    'new-parens': 'error',

    /**
     * Require a newline after each call in a method chain
     *
     * @link https://eslint.org/docs/latest/rules/newline-per-chained-call
     */
    'newline-per-chained-call': 'error',

    /**
     * Disallow unnecessary parentheses
     *
     * @link https://eslint.org/docs/latest/rules/no-extra-parens
     */
    'no-extra-parens': 'error',

    /**
     * Disallow mixed spaces and tabs for indentation
     *
     * @link https://eslint.org/docs/latest/rules/no-mixed-spaces-and-tabs
     */
    'no-mixed-spaces-and-tabs': 'error',

    /**
     * Disallow multiple spaces
     *
     * @link https://eslint.org/docs/latest/rules/no-multi-spaces
     */
    'no-multi-spaces': 'error',

    /**
     * Disallow multiple empty lines
     *
     * @link https://eslint.org/docs/latest/rules/no-multiple-empty-lines
     */
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],

    /**
     * Disallow all tabs
     *
     * @link https://eslint.org/docs/latest/rules/no-tabs
     */
    'no-tabs': 'error',

    /**
     * Disallow trailing whitespace at the end of lines
     *
     * @link https://eslint.org/docs/latest/rules/no-trailing-spaces
     */
    'no-trailing-spaces': 'error',

    /**
     * Disallow whitespace before properties
     *
     * @link https://eslint.org/docs/latest/rules/no-whitespace-before-property
     */
    'no-whitespace-before-property': 'error',

    /**
     * Enforce the location of single-line statements
     *
     * @link https://eslint.org/docs/latest/rules/nonblock-statement-body-position
     */
    'nonblock-statement-body-position': 'error',

    /**
     * Enforce consistent line breaks after opening and before closing braces
     *
     * @link https://eslint.org/docs/latest/rules/object-curly-newline
     */
    'object-curly-newline': 'error',

    /**
     * Enforce consistent spacing inside braces
     *
     * @link https://eslint.org/docs/latest/rules/object-curly-spacing
     */
    'object-curly-spacing': 'error',

    /**
     * Enforce placing object properties on separate lines
     *
     * @link https://eslint.org/docs/latest/rules/object-property-newline
     */
    'object-property-newline': 'error',

    /**
     * Enforce consistent linebreak style for operators
     *
     * @link https://eslint.org/docs/latest/rules/operator-linebreak
     */
    'operator-linebreak': 'error',

    /**
     * Require or disallow padding within blocks
     *
     * @link https://eslint.org/docs/latest/rules/padded-blocks
     */
    'padded-blocks': 'error',

    /**
     * Require or disallow padding lines between statements
     *
     * @link https://eslint.org/docs/latest/rules/padding-line-between-statements
     */
    'padding-line-between-statements': 'error',

    /**
     * Enforce the consistent use of either backticks, double, or single quotes
     *
     * @link https://eslint.org/docs/latest/rules/quotes
     */
    quotes: 'error',

    /**
     * Enforce spacing between rest and spread operators and their expressions
     *
     * @link https://eslint.org/docs/latest/rules/rest-spread-spacing
     */
    'rest-spread-spacing': 'error',

    /**
     * Require or disallow semicolons instead of ASI
     *
     * @link https://eslint.org/docs/latest/rules/semi
     */
    semi: 'error',

    /**
     * Enforce consistent spacing before and after semicolons
     *
     * @link https://eslint.org/docs/latest/rules/semi-spacing
     */
    'semi-spacing': 'error',

    /**
     * Enforce location of semicolons
     *
     * @link https://eslint.org/docs/latest/rules/semi-style
     */
    'semi-style': 'error',

    /**
     * Enforce consistent spacing before blocks
     *
     * @link https://eslint.org/docs/latest/rules/space-before-blocks
     */
    'space-before-blocks': 'error',

    /**
     * Enforce consistent spacing before `function` definition opening parenthesis
     *
     * @link https://eslint.org/docs/latest/rules/space-before-function-paren
     */
    'space-before-function-paren': 'error',

    /**
     * Enforce consistent spacing inside parentheses
     *
     * @link https://eslint.org/docs/latest/rules/space-in-parens
     */
    'space-in-parens': 'error',

    /**
     * Require spacing around infix operators
     *
     * @link https://eslint.org/docs/latest/rules/space-infix-ops
     */
    'space-infix-ops': 'error',

    /**
     * Enforce consistent spacing before or after unary operators
     *
     * @link https://eslint.org/docs/latest/rules/space-unary-ops
     */
    'space-unary-ops': 'error',

    /**
     * Enforce spacing around colons of switch statements
     *
     * @link https://eslint.org/docs/latest/rules/switch-colon-spacing
     */
    'switch-colon-spacing': 'error',

    /**
     * Require or disallow spacing around embedded expressions of template strings
     *
     * @link https://eslint.org/docs/latest/rules/template-curly-spacing
     */
    'template-curly-spacing': 'error',

    /**
     * Require or disallow spacing between template tags and their literals
     *
     * @link https://eslint.org/docs/latest/rules/template-tag-spacing
     */
    'template-tag-spacing': 'error',

    /**
     * Require or disallow Unicode byte order mark (BOM)
     *
     * @link https://eslint.org/docs/latest/rules/unicode-bom
     */
    'unicode-bom': 'error',

    /**
     * Require parentheses around immediate `function` invocations
     *
     * @link https://eslint.org/docs/latest/rules/wrap-iife
     */
    'wrap-iife': 'error',

    /**
     * Require parenthesis around regex literals
     *
     * @link https://eslint.org/docs/latest/rules/wrap-regex
     */
    'wrap-regex': 'error',

    /**
     * Require or disallow spacing around the `*` in `yield*` expressions
     *
     * @link https://eslint.org/docs/latest/rules/yield-star-spacing
     */
    'yield-star-spacing': 'error'
  }
};
