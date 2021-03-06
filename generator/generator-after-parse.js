import generator from './generator';

function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then
    // outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator
        ? outerFn
        : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next, .throw, and
    // .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
}

function makeInvokeMethod(innerFn, self, context) {

    return function invoke(method, arg) {
        context.method = method;
        if (context.method === "next") {
            context.sent = context._sent = context.arg;
        }
        var record = {
            arg: fn.call(obj, context.arg)
        };
        return {value: record.arg, done: context.done};
    };
}


function next(arg) {
    generator._invoke('next', arg);
}


function call(state, fn, err, arg) {
    if  (state === 'pedding') {
        fn(arg);
    } else {
        fn(err);
    }

}
// var Promise = function (fn) {
//     this.state = 'pedding';
//     this.fn = {};
//     return fn(this.resolve, this.reject);
// }
// Promise.prototype.then = function (fn) {
//     this.fn = fn;
//     return this;
// }
// Promise.prototype.resolve = function (arg) {
//     this.state = 'resolved';
//     call(this.state, this.fn, null, arg);
//     return this;
// }
// Promise.prototype.reject = function () {
//     this.state = 'rejected';
//     var err = "err opened";
//     call(this.state, this.fn, err);
//     return this;
// }
// new Promise(function (resolve, reject) {
//     setTimeout(function () {
//         var value = 'abc';
//         resolve(value);
//     }, 100);
// }).then(function (result) {
//     console.log(result);
// });