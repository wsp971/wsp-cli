/**
 * 该 ESLint 配置扩展自 eslint-config-o2team-wx
 * https://www.npmjs.com/package/eslint-config-o2team-wx
 * o2team-wx 这一套规则是参考了 StandardJS 和 Airbnb 的 JS 规范，然后结合业务中的最佳实践整理输出的。
 */
module.exports = {
    'extends': 'o2team-wx',
    'parser':'babel-eslint',
    'env': {
        'browser': true,
        'commonjs': true,
        'es6': true,
    },
    'globals': {
        'Vue': false,
    },
    'plugins': ['html'],
    'rules': {
        //要求方法链中每个调用都有一个换行符
        'newline-per-chained-call': 'off',
        //要求使用 === 和 !==
        'eqeqeq': 'off',
        //强制使用一致的缩进
        'indent': ['error', 4, { SwitchCase: 1 }],
        //要求使用剩余参数而不是 arguments
        'prefer-rest-params': 'off',
        //要求使用模板字面量而非字符串连接
        'prefer-template': 'off',
        //禁止 if 语句中 return 语句之后有 else 块
        'no-else-return': 'off',
        //禁用嵌套的三元表达式
        'no-nested-ternary': 'off',
        //强制在代码块中使用一致的大括号风格
        'brace-style': 'off',
        //要求使用分号代替 ASI
        'semi': 'off',
        // ESLint 配置问题，暂时不强制所有变量名都用驼峰式命名
        'camelcase': ['off', { properties: 'never' }],
        // 强制数组方法的回调函数中有 return 语句
        'array-callback-return': 'off',
        //要求使用 const 声明那些声明后不再被修改的变量
        'prefer-const': 'warn',
        //禁止混合使用不同的操作符
        'no-mixed-operators': 'off',
        //强制数组方法的回调函数中有 return 语句
        'callback-return': 'warn',
        //强制类方法使用 this
        'class-methods-use-this': 'warn',
        'no-var':'off',
        //禁用 console
        'no-console':'off'
    }
};
